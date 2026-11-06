import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandMarkProps {
  href?: string;
  label?: string;
  className?: string;
  /** Hide the "Revo OS" wordmark, showing only the icon tile. */
  iconOnly?: boolean;
}

/**
 * Application brand lockup. Uses the official brand asset (`public/icon.svg`)
 * so the product matches the marketing site and installed app icon exactly.
 * The marketing site renders its own mark; this copy is intentional so the
 * frozen marketing components remain untouched.
 */
export function BrandMark({
  href = "/dashboard",
  label = "Revo OS",
  className,
  iconOnly = false,
}: BrandMarkProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn("flex items-center gap-2.5", className)}
    >
      <Image
        src="/icon.svg"
        alt=""
        width={32}
        height={32}
        className="size-8 shrink-0 rounded-xl shadow-sm"
        priority
      />
      {!iconOnly && (
        <span className="font-display text-[15px] font-semibold tracking-tight text-heading">
          Revo OS
        </span>
      )}
    </Link>
  );
}
