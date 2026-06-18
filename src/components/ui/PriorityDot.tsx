import { getPriorityConfig } from "@/lib/constants";
import type { PriorityId } from "@/lib/types";

/**
 * Priority indicator: a small colored dot whose name is exposed to assistive tech
 * via role="img" + aria-label. "Urgent" additionally gets a ring, so priority is
 * never conveyed by color alone (WCAG 1.4.1).
 */
export function PriorityDot({
  priority,
  label,
}: {
  priority: PriorityId;
  label: string;
}) {
  const cfg = getPriorityConfig(priority);
  return (
    <span role="img" title={label} aria-label={label} className="inline-flex">
      <span
        className={`inline-block h-2 w-2 shrink-0 rounded-full ${
          priority === "urgent" ? "ring-2 ring-danger/50 ring-offset-1" : ""
        }`}
        style={{ backgroundColor: cfg.color }}
        aria-hidden
      />
    </span>
  );
}
