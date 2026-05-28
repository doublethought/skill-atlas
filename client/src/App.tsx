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
            <a
              href="https://vincentfeeney.com"
              target="_blank"
              rel="noreferrer"
              className="pointer-events-auto rounded-full border bg-background/82 px-3.5 py-2 font-mono text-[0.68rem] font-medium uppercase tracking-normal text-muted-foreground shadow-sm backdrop-blur transition-colors hover:border-primary/35 hover:text-foreground"
            >
              made by <span className="text-primary">vincentfeeney</span>
            </a>
          </footer>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
