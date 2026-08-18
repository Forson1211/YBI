import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    document.body.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [location]);

  return null;
}

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
import TeamProfile from "./pages/TeamProfile";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import GetInvolved from "./pages/GetInvolved";
import FAQ from "./pages/FAQ";
import Legal from "./pages/Legal";
import { YbiVisitorAssistant } from "./components/YbiVisitorAssistant";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/about"} component={About} />
      <Route path={"/team"} component={Team} />
      <Route path={"/team/:slug"} component={TeamProfile} />
      <Route path={"/focus-areas"} component={FocusAreas} />
      <Route path={"/programs"} component={Programs} />
      <Route path={"/events"} component={Events} />
      <Route path={"/events/:slug"} component={EventDetail} />
      <Route path={"/blog"} component={Blog} />
      <Route path={"/blog/:slug"} component={BlogPost} />
      <Route path={"/get-involved"} component={GetInvolved} />
      <Route path={"/donate"} component={GetInvolved} />
      <Route path={"/join-us"} component={JoinUs} />
      <Route path={"/media"} component={Media} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/faq"} component={FAQ} />
      <Route path={"/gallery"} component={Gallery} />
      <Route path={"/privacy-policy"}>{() => <Legal variant="privacy" />}</Route>
      <Route path={"/terms-of-use"}>{() => <Legal variant="terms" />}</Route>
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
            <ScrollToTop />
            <Toaster />
            <Router />
            <YbiVisitorAssistant />
          </TooltipProvider>

      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
