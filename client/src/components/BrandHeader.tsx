import { Compass } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "wouter";

export function LogoMark() {
  return (
    <div className="brand-mark relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg text-white">
      <div className="brand-mark-grid absolute inset-0 opacity-60" />
      <Compass className="relative h-7 w-7" strokeWidth={1.8} />
    </div>
  );
}

export default function BrandHeader() {
  return (
    <Link href="/">
      <button
        className="flex h-12 items-center gap-3 rounded-md p-1 pr-3 transition-colors hover:bg-background/70"
        aria-label="Skill Atlas"
      >
        <LogoMark />
        <span className="flex items-baseline gap-1.5 font-display leading-none tracking-normal">
          <span className="text-lg font-semibold">Skill</span>
          {" "}
          <span className="text-lg font-medium text-primary">Atlas</span>
        </span>
      </button>
    </Link>
  );
}

export function AppHeader({ action }: { action?: ReactNode }) {
  return (
    <nav className="glass-nav sticky top-0 z-50 border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <BrandHeader />
        <div className="flex h-10 items-center justify-end">
          {action}
        </div>
      </div>
    </nav>
  );
}
