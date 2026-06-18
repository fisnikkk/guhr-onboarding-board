/**
 * Guhr Steuerberatung logo — a faithful reconstruction of the firm's monochrome
 * gold horizontal lockup (gold "G" monogram + "GUHR / STEUERBERATUNG" wordmark).
 * Built in markup rather than copying the proprietary SVG asset.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex select-none items-center gap-2.5 ${className}`}>
      <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full ring-2 ring-brand">
        <span className="text-[20px] font-black leading-none text-brand">G</span>
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[18px] font-black tracking-tight text-brand">
          GUHR
        </span>
        <span className="mt-[3px] text-[8.5px] font-bold tracking-[0.22em] text-slate">
          STEUERBERATUNG
        </span>
      </span>
    </span>
  );
}
