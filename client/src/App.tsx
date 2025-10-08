import { Route, Switch } from "wouter";
import Landing from "./pages/landing";
import Search from "./components/search";
import Destinations from "./pages/destinations";
import DestinationDetail from "./pages/destination/[slug]";
import MapPage from "./pages/map";
import TripKits from "./pages/tripkits";
import TripKitDetail from "./pages/tripkits/[slug]";
// Mt. Olympians archived - will return as TripKit in Phase 3
// import MtOlympians from "./pages/archive/mt-olympians";
import Categories from "./pages/categories";
import CategoryDetail from "./pages/categories/[driveTime]";
import SubcategoryDetail from "./pages/categories/[driveTime]/[subcategory]";
import About from "./pages/about";
import Contact from "./pages/contact";
import Terms from "./pages/terms";
import Privacy from "./pages/privacy";
import Navigation from "./components/navigation";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main>
        <Switch>
          {/* Main Pages */}
          <Route path="/" component={Landing} />
          <Route path="/search" component={Search} />
          <Route path="/map" component={MapPage} />
          <Route path="/destinations" component={Destinations} />
          <Route path="/destination/:slug" component={DestinationDetail} />
          
          {/* TripKits */}
          <Route path="/tripkits" component={TripKits} />
          <Route path="/tripkits/:slug" component={TripKitDetail} />
          
          {/* Mt. Olympians - Archived, will return as TripKit in Phase 3 */}
          {/* <Route path="/mt-olympians" component={MtOlympians} /> */}
          
          {/* Categories & Subcategories */}
          <Route path="/categories" component={Categories} />
          <Route path="/categories/:driveTime" component={CategoryDetail} />
          <Route path="/categories/:driveTime/:subcategory" component={SubcategoryDetail} />
          
          {/* Static Pages */}
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/terms" component={Terms} />
          <Route path="/privacy" component={Privacy} />
          
          {/* 404 Fallback */}
          <Route component={() => <div className="p-8 text-center">Page not found</div>} />
        </Switch>
      </main>
    </div>
  );
}