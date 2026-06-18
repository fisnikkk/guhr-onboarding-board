import { getMandateConfig } from "@/lib/constants";
import type { MandateTypeId } from "@/lib/types";

/** Small tinted badge for a mandate type (Mandatsart). Label is supplied localized. */
export function MandateBadge({
  mandateType,
  label,
}: {
  mandateType: MandateTypeId;
  label: string;
}) {
  const cfg = getMandateConfig(mandateType);
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-[3px] text-[11px] font-bold leading-none"
      style={{ backgroundColor: cfg.bg, color: cfg.fg }}
    >
      {label}
    </span>
  );
}
