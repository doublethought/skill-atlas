import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export type Level = "P30" | "P40" | "P50" | "P60" | "P70";

export interface Designer {
  id: string;
  name: string;
  level: Level;
  maturityInRole: number;
  fitForRole: number;
  archetype: "Craft-y" | "Systems-y" | "Business-y";
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

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string): string {
  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-cyan-500",
    "bg-emerald-500",
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

  const avatar = (
    <div
      className={`${sizeClasses[size]} ${bgColor} rounded-full flex items-center justify-center text-white font-mono font-medium border-2 border-white dark:border-gray-800 shadow-sm cursor-default`}
      data-testid={`avatar-${designer.id}`}
    >
      {initials}
    </div>
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
