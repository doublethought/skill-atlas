import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  getAvatarIndex,
  getInitials,
  getOpenPeepsUrl,
  OPEN_PEEPS_AVATARS,
} from "@/lib/openPeeps";

export const MANAGER_AVATARS = OPEN_PEEPS_AVATARS;

interface ManagerAvatarProps {
  value?: string | null;
  name: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-12 w-12",
  md: "h-14 w-14",
  lg: "h-16 w-16",
};

function resolveAvatar(value: string | null | undefined, name: string) {
  if (value?.startsWith("data:image/")) {
    return { image: value };
  }

  const direct = MANAGER_AVATARS.find((avatar) => avatar.id === value);
  if (direct) {
    return direct;
  }

  return MANAGER_AVATARS[getAvatarIndex(value || name || "manager")];
}

export default function ManagerAvatar({
  value,
  name,
  className,
  size = "md",
}: ManagerAvatarProps) {
  const avatar = useMemo(() => resolveAvatar(value, name), [name, value]);
  const imageSrc = "image" in avatar ? avatar.image : getOpenPeepsUrl(avatar.seed, avatar.background);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [imageSrc]);

  if (imageError) {
    return (
      <div
        className={cn(
          sizeClasses[size],
          "flex items-center justify-center rounded-lg border bg-primary font-mono font-semibold text-primary-foreground shadow-sm",
          className,
        )}
        aria-hidden="true"
      >
        {getInitials(name)}
      </div>
    );
  }

  if ("image" in avatar) {
    return (
      <img
        alt=""
        src={avatar.image}
        className={cn(sizeClasses[size], "rounded-lg border bg-card object-cover shadow-sm", className)}
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <img
      alt=""
      src={imageSrc}
      className={cn(sizeClasses[size], "rounded-lg border bg-card object-cover shadow-sm", className)}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setImageError(true)}
      aria-hidden="true"
    />
  );
}
