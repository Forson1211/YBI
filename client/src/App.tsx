// Design reminder: The Commons of Becoming — warm editorial nonprofit design,
// asymmetric rhythm, forest ink + Workshop Marigold, and human invitation over polish.
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FocusAreas from "./pages/FocusAreas";
import Gallery from "./pages/Gallery";
import AdminDashboard from "./pages/AdminDashboard";
import JoinUs from "./pages/JoinUs";
import Media from "./pages/Media";
import Programs from "./pages/Programs";
import Team from "./pages/Team";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/about"} component={About} />
      <Route path={"/team"} component={Team} />
      <Route path={"/focus-areas"} component={FocusAreas} />
      <Route path={"/programs"} component={Programs} />
      <Route path={"/join-us"} component={JoinUs} />
      <Route path={"/media"} component={Media} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/gallery"} component={Gallery} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/admin/:section"} component={AdminDashboard} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
