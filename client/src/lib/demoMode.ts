import { demoDesigners, demoManager } from "@shared/demoData";

export const isReadOnlyDemo = import.meta.env.VITE_DEMO_MODE === "readonly";

export function getDemoData(url: string) {
  if (url === "/api/managers") {
    return [demoManager];
  }

  if (url === `/api/managers/${demoManager.id}`) {
    return demoManager;
  }

  if (url === `/api/managers/${demoManager.id}/designers`) {
    return demoDesigners;
  }

  if (url.startsWith("/api/designers/")) {
    const designerId = url.replace("/api/designers/", "");
    return demoDesigners.find((designer) => designer.id === designerId) ?? null;
  }

  return undefined;
}
