export const OPEN_PEEPS_AVATARS = [
  { id: "avatar:aurora", name: "Aurora", seed: "skill-atlas-aurora", background: "d1f4ee" },
  { id: "avatar:signal", name: "Signal", seed: "skill-atlas-signal", background: "d7e6ff" },
  { id: "avatar:bloom", name: "Bloom", seed: "skill-atlas-bloom", background: "ffd9e6" },
  { id: "avatar:orbit", name: "Orbit", seed: "skill-atlas-orbit", background: "efe0ff" },
  { id: "avatar:mesa", name: "Mesa", seed: "skill-atlas-mesa", background: "f8e4c8" },
  { id: "avatar:pixel", name: "Pixel", seed: "skill-atlas-pixel", background: "dbeafe" },
  { id: "avatar:tempo", name: "Tempo", seed: "skill-atlas-tempo", background: "fde68a" },
  { id: "avatar:loop", name: "Loop", seed: "skill-atlas-loop", background: "e9d5ff" },
  { id: "avatar:sage", name: "Sage", seed: "skill-atlas-sage", background: "dcfce7" },
  { id: "avatar:coral", name: "Coral", seed: "skill-atlas-coral", background: "fed7d7" },
  { id: "avatar:indigo", name: "Indigo", seed: "skill-atlas-indigo", background: "c7d2fe" },
  { id: "avatar:mint", name: "Mint", seed: "skill-atlas-mint", background: "ccfbf1" },
  { id: "avatar:sunrise", name: "Sunrise", seed: "skill-atlas-sunrise", background: "ffedd5" },
  { id: "avatar:slate", name: "Slate", seed: "skill-atlas-slate", background: "e2e8f0" },
  { id: "avatar:orchid", name: "Orchid", seed: "skill-atlas-orchid", background: "fbcfe8" },
  { id: "avatar:lagoon", name: "Lagoon", seed: "skill-atlas-lagoon", background: "bae6fd" },
  { id: "avatar:olive", name: "Olive", seed: "skill-atlas-olive", background: "d9f99d" },
  { id: "avatar:ember", name: "Ember", seed: "skill-atlas-ember", background: "fecaca" },
  { id: "avatar:violet", name: "Violet", seed: "skill-atlas-violet", background: "ddd6fe" },
  { id: "avatar:canvas", name: "Canvas", seed: "skill-atlas-canvas", background: "f5f5f4" },
] as const;

export type OpenPeepsAvatar = (typeof OPEN_PEEPS_AVATARS)[number];

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getAvatarIndex(seedValue: string, length = OPEN_PEEPS_AVATARS.length) {
  const seed = (seedValue || "avatar")
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return seed % length;
}

export function getOpenPeepsUrl(seed: string, background: string) {
  const params = new URLSearchParams({
    seed,
    backgroundColor: background,
    radius: "14",
  });

  return `https://api.dicebear.com/10.x/open-peeps/svg?${params.toString()}`;
}
