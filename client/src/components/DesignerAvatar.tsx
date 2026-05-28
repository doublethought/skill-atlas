import { useEffect, useMemo, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  getAvatarIndex,
  getInitials,
  getOpenPeepsUrl,
  OPEN_PEEPS_AVATARS,
} from "@/lib/openPeeps";

export type Level = "Associate Designer" | "Midweight Designer" | "Senior Designer" | "Lead Designer" | "Staff Designer";

export interface Designer {
  id: string;
  name: string;
  level: Level;
  maturityInRole: number;
  fitForRole: number;
  archetype: "Craft" | "Systems" | "Strategy";
  skills: Record<string, number>;
}

interface DesignerAvatarProps {
  designer: Designer;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  color?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
};

function getAvatarColor(name: string): string {
  const colors = [
    "bg-teal-600",
    "bg-violet-600",
    "bg-orange-500",
    "bg-sky-600",
    "bg-rose-600",
    "bg-emerald-600",
    "bg-cyan-600",
    "bg-amber-500",
  ];
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

export default function DesignerAvatar({
  designer,
  size = "md",
  showTooltip = true,
  color,
}: DesignerAvatarProps) {
  const initials = getInitials(designer.name);
  const bgColor = color || getAvatarColor(designer.name);
  const openPeepsAvatar = useMemo(() => {
    return OPEN_PEEPS_AVATARS[getAvatarIndex(`${designer.id}-${designer.name}`)];
  }, [designer.id, designer.name]);
  const imageSrc = getOpenPeepsUrl(openPeepsAvatar.seed, openPeepsAvatar.background);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [imageSrc]);

  const fallbackAvatar = (
    <div
      className={`${sizeClasses[size]} ${bgColor} flex cursor-default items-center justify-center rounded-md border-2 border-white font-mono font-semibold text-white shadow-sm dark:border-gray-800`}
      data-testid={`avatar-${designer.id}`}
    >
      {initials}
    </div>
  );

  const avatar = imageError ? (
    fallbackAvatar
  ) : (
    <img
      alt=""
      src={imageSrc}
      className={`${sizeClasses[size]} cursor-default rounded-md border-2 border-white bg-card object-cover shadow-sm dark:border-gray-800`}
      data-testid={`avatar-${designer.id}`}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setImageError(true)}
      aria-hidden="true"
    />
  );

  if (!showTooltip) {
    return avatar;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{avatar}</TooltipTrigger>
      <TooltipContent className="bg-popover border border-border">
        <div className="flex flex-col gap-1">
          <span className="font-sans font-medium text-foreground">{designer.name}</span>
          <span className="font-mono text-xs text-muted-foreground">{designer.level}</span>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
