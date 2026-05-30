import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { isReadOnlyDemo } from "@/lib/demoMode";
import NotFound from "@/pages/not-found";
import ManagersPage from "@/pages/ManagersPage";
import Dashboard from "@/pages/Dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={ManagersPage} />
      <Route path="/managers/:managerId" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        {isReadOnlyDemo && (
          <footer className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
            <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border bg-background/82 px-3.5 py-2 text-center font-mono text-[0.68rem] font-medium uppercase tracking-normal text-muted-foreground shadow-sm backdrop-blur">
              <span>
                made by{" "}
                <a
                  href="https://vincentfeeney.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary transition-colors hover:text-foreground"
                >
                  Vincent Feeney
                </a>
              </span>
              <span className="text-border">/</span>
              <span>
                avatars by{" "}
                <a
                  href="https://www.openpeeps.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary transition-colors hover:text-foreground"
                >
                  Open Peeps
                </a>{" "}
                by{" "}
                <a
                  href="https://www.pablostanley.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary transition-colors hover:text-foreground"
                >
                  Pablo Stanley
                </a>
              </span>
            </div>
          </footer>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
