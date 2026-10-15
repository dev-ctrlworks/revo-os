#!/usr/bin/env node
/**
 * Regenerates the static Revo OS logo assets from public/icon.svg so every
 * logo matches the in-app treatment: the white lucide "brain-circuit" glyph
 * on the brand-gradient rounded square.
 *
 *   node scripts/generate-logos.mjs
 *
 * Outputs:
 *   public/apple-touch-icon.png  (180x180)
 *   public/favicon-16x16.png     (16x16,  Google-eligible)
 *   public/favicon-32x32.png     (32x32,  Google-eligible)
 *   public/favicon-48x48.png     (48x48,  Google-eligible)
 *   public/icon-192.png          (192x192, web manifest)
 *   public/icon-512.png          (512x512, web manifest, maskable)
 *   public/favicon.ico           (32x32, PNG-embedded ICO)
 *   public/logo.png              (512x512, structured-data / knowledge panel)
 *   public/og.png                (1200x630 social card)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const source = join(root, "public", "icon.svg");

const svg = readFileSync(source);

function gradientDef(id) {
  return `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">${[
    '<stop offset="0" stop-color="#805ddf"/>',
    '<stop offset="0.55" stop-color="#4983e5"/>',
    '<stop offset="1" stop-color="#59bbfb"/>',
  ].join("")}</linearGradient>`;
}

/** PNG-embedded ICO container (valid for modern browsers + Windows Vista+). */
function pngToIco(png, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // count

  const entry = Buffer.alloc(16);
  entry.writeUInt8(size >= 256 ? 0 : size, 0); // width
  entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
  entry.writeUInt8(0, 2); // palette
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // planes
  entry.writeUInt16LE(32, 6); // bit depth
  entry.writeUInt32LE(png.length, 8); // size
  entry.writeUInt32LE(6 + 16, 12); // offset past header + entry

  return Buffer.concat([header, entry, png]);
}

async function main() {
  // Apple touch icon (180x180 PNG)
  const apple = await sharp(svg).resize(180, 180).png().toBuffer();
  writeFileSync(join(root, "public", "apple-touch-icon.png"), apple);

  // Google-eligible favicons and web-manifest app icons.
  const png = {};
  for (const size of [16, 32, 48, 192, 512]) {
    png[size] = await sharp(svg).resize(size, size).png().toBuffer();
  }
  writeFileSync(join(root, "public", "favicon-16x16.png"), png[16]);
  writeFileSync(join(root, "public", "favicon-32x32.png"), png[32]);
  writeFileSync(join(root, "public", "favicon-48x48.png"), png[48]);
  writeFileSync(join(root, "public", "icon-192.png"), png[192]);
  writeFileSync(join(root, "public", "icon-512.png"), png[512]);

  // Favicon (32x32 PNG-embedded ICO)
  const fav = await sharp(svg).resize(32, 32).png().toBuffer();
  writeFileSync(join(root, "public", "favicon.ico"), pngToIco(fav, 32));

  // Square logo for structured data / knowledge panel (512x512)
  const logo = await sharp(svg).resize(512, 512).png().toBuffer();
  writeFileSync(join(root, "public", "logo.png"), logo);

  // Social card (1200x630): gradient + text, with the mark composited on top
  // (librsvg doesn't reliably render <image> data-URIs, so no <image> tag here).
  const mark = await sharp(svg).resize(180, 180).png().toBuffer();
  const font =
    "Space Grotesk, Inter, 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif";
  const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>${gradientDef("ogBrand")}</defs>
  <rect width="1200" height="630" fill="url(#ogBrand)"/>
  <rect width="1200" height="630" fill="#0b0a12" opacity="0.18"/>
  <text x="600" y="372" text-anchor="middle" fill="#ffffff" font-family="${font}" font-size="92" font-weight="700" letter-spacing="-2">Revo OS</text>
  <text x="600" y="438" text-anchor="middle" fill="#ffffff" opacity="0.92" font-family="${font}" font-size="34">Save anything. Remember why.</text>
  <g>
    <rect x="508" y="478" width="184" height="54" rx="27" fill="#ffffff" opacity="0.16"/>
    <text x="600" y="513" text-anchor="middle" fill="#ffffff" font-family="${font}" font-size="24" font-weight="600">revoos.app</text>
  </g>
</svg>`;
  const ogPng = await sharp(Buffer.from(og))
    .resize(1200, 630)
    .composite([{ input: mark, left: 510, top: 110 }])
    .png()
    .toBuffer();
  writeFileSync(join(root, "public", "og.png"), ogPng);

  for (const [name, buf] of [
    ["apple-touch-icon.png", apple],
    ["favicon-16x16.png", png[16]],
    ["favicon-32x32.png", png[32]],
    ["favicon-48x48.png", png[48]],
    ["icon-192.png", png[192]],
    ["icon-512.png", png[512]],
    ["favicon.ico", fav],
    ["logo.png", logo],
    ["og.png", ogPng],
  ]) {
    const meta = await sharp(buf).metadata();
    console.log(
      `✓ ${name}  ${meta.width}x${meta.height}  ${(buf.length / 1024).toFixed(1)} KiB`
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});