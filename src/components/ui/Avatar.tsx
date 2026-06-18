import { User } from "lucide-react";
import { getContrastText } from "@/lib/colors";
import type { TeamMember } from "@/lib/types";

/**
 * Circular initials avatar for a team member. Renders a dashed placeholder when
 * the card is unassigned. Text color is auto-chosen for contrast on the avatar bg.
 */
export function Avatar({
  member,
  size = 28,
  title,
}: {
  member?: TeamMember;
  size?: number;
  title?: string;
}) {
  if (!member) {
    return (
      <span
        role="img"
        title={title}
        aria-label={title}
        className="inline-flex shrink-0 items-center justify-center rounded-full border border-dashed border-line-mid text-muted"
        style={{ width: size, height: size }}
      >
        <User size={Math.round(size * 0.5)} strokeWidth={1.75} aria-hidden />
      </span>
    );
  }

  return (
    <span
      role="img"
      title={title ?? member.name}
      aria-label={title ?? member.name}
      className="inline-flex shrink-0 items-center justify-center rounded-full font-bold leading-none"
      style={{
        width: size,
        height: size,
        backgroundColor: member.color,
        color: getContrastText(member.color),
        fontSize: Math.round(size * 0.4),
      }}
    >
      {member.initials}
    </span>
  );
}
