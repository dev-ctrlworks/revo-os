import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

/**
 * Renders a one-page PDF brief from a collection summary written as Markdown.
 *
 * Pure and dependency-light (pdf-lib only, no system fonts or native modules)
 * so it runs on Cloudflare Workers. Supports the small Markdown subset the
 * summarizer emits: `#`/`##` headings and `-` bullets, plus plain paragraphs.
 */

const PAGE_WIDTH = 612; // US Letter, points
const PAGE_HEIGHT = 792;
const MARGIN = 64;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const BOTTOM_MARGIN = 64;

const HEADING_COLOR = rgb(0.13, 0.09, 0.3);
const BODY_COLOR = rgb(0.28, 0.27, 0.35);
const MUTED_COLOR = rgb(0.51, 0.5, 0.58);
const RULE_COLOR = rgb(0.87, 0.86, 0.92);

interface Line {
  text: string;
  size: number;
  font: PDFFont;
  color: ReturnType<typeof rgb>;
  gapBefore: number;
  gapAfter: number;
  indent: number;
}

interface RenderOptions {
  collectionName: string;
  markdown: string;
  generatedAt: Date;
}

function wrapText(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      current = candidate;
      continue;
    }
    if (current) lines.push(current);
    current = word;
  }
  if (current) lines.push(current);
  return lines.length > 0 ? lines : [""];
}

function sanitize(text: string): string {
  // pdf-lib's standard fonts use WinAnsi; drop characters it cannot encode.
  return text.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "");
}

function buildLines(
  markdown: string,
  fonts: { regular: PDFFont; bold: PDFFont; italic: PDFFont }
): Line[] {
  const lines: Line[] = [];
  const blank = sanitize(markdown).split(/\r?\n/);

  for (const raw of blank) {
    const trimmed = raw.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("# ")) {
      for (const part of wrapText(trimmed.slice(2), fonts.bold, 20, CONTENT_WIDTH)) {
        lines.push({
          text: part,
          size: 20,
          font: fonts.bold,
          color: HEADING_COLOR,
          gapBefore: 0,
          gapAfter: 2,
          indent: 0,
        });
      }
      continue;
    }

    if (trimmed.startsWith("## ")) {
      for (const part of wrapText(trimmed.slice(3), fonts.bold, 13, CONTENT_WIDTH)) {
        lines.push({
          text: part,
          size: 13,
          font: fonts.bold,
          color: HEADING_COLOR,
          gapBefore: 10,
          gapAfter: 3,
          indent: 0,
        });
      }
      continue;
    }

    const bulletMatch = /^[-*]\s+(.*)$/.exec(trimmed);
    if (bulletMatch) {
      const bulletIndent = 16;
      const wrapped = wrapText(
        `\u2022  ${bulletMatch[1]}`,
        fonts.regular,
        11,
        CONTENT_WIDTH - bulletIndent
      );
      wrapped.forEach((part, index) => {
        lines.push({
          text: part,
          size: 11,
          font: fonts.regular,
          color: BODY_COLOR,
          gapBefore: index === 0 ? 1 : 0,
          gapAfter: 0,
          indent: bulletIndent,
        });
      });
      continue;
    }

    for (const part of wrapText(trimmed, fonts.regular, 11, CONTENT_WIDTH)) {
      lines.push({
        text: part,
        size: 11,
        font: fonts.regular,
        color: BODY_COLOR,
        gapBefore: 0,
        gapAfter: 1,
        indent: 0,
      });
    }
  }

  return lines;
}

/** Renders the summary Markdown into a downloadable PDF byte array. */
export async function renderSummaryPdf({
  collectionName,
  markdown,
  generatedAt,
}: RenderOptions): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const italic = await doc.embedFont(StandardFonts.HelveticaOblique);

  doc.setTitle(`${collectionName} — summary`);
  doc.setProducer("Revo OS");
  doc.setCreator("Revo OS");
  doc.setCreationDate(generatedAt);

  const lines = buildLines(markdown, { regular, bold, italic });
  const pages: PDFPage[] = [];

  let page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  pages.push(page);
  let cursorY = PAGE_HEIGHT - MARGIN;

  // Header
  page.drawText(sanitize(collectionName), {
    x: MARGIN,
    y: cursorY - 18,
    size: 18,
    font: bold,
    color: HEADING_COLOR,
  });
  cursorY -= 40;
  const meta = `Revo OS · collection brief · generated ${generatedAt
    .toISOString()
    .slice(0, 10)}`;
  page.drawText(sanitize(meta), {
    x: MARGIN,
    y: cursorY,
    size: 9,
    font: regular,
    color: MUTED_COLOR,
  });
  cursorY -= 14;
  page.drawLine({
    start: { x: MARGIN, y: cursorY },
    end: { x: PAGE_WIDTH - MARGIN, y: cursorY },
    thickness: 1,
    color: RULE_COLOR,
  });
  cursorY -= 18;

  for (const line of lines) {
    cursorY -= line.gapBefore;
    const lineHeight = line.size * 1.45;
    if (cursorY - lineHeight < BOTTOM_MARGIN) {
      page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      pages.push(page);
      cursorY = PAGE_HEIGHT - MARGIN;
    }
    page.drawText(line.text, {
      x: MARGIN + line.indent,
      y: cursorY - line.size,
      size: line.size,
      font: line.font,
      color: line.color,
    });
    cursorY -= lineHeight + line.gapAfter;
  }

  // Footer page numbers
  pages.forEach((p, index) => {
    const label = `${index + 1} / ${pages.length}`;
    const width = regular.widthOfTextAtSize(label, 8);
    p.drawText(label, {
      x: PAGE_WIDTH - MARGIN - width,
      y: MARGIN / 2,
      size: 8,
      font: regular,
      color: MUTED_COLOR,
    });
  });

  return doc.save();
}
