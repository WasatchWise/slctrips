import { Route, Switch } from "wouter";
import Landing from "./pages/landing";
import Search from "./components/search";
import Destinations from "./pages/destinations";
import DestinationDetail from "./pages/destination/slug";
import TripKits from "./pages/tripkits";
import TripKitDetail from "./pages/tripkits/[kitId]";
import MtOlympians from "./pages/mt-olympians";
import Categories from "./pages/categories";
import CategoryDetail from "./pages/categories/[driveTime]";
import SubcategoryDetail from "./pages/categories/[driveTime]/[subcategory]";
import About from "./pages/about";
import Contact from "./pages/contact";
import Terms from "./pages/terms";
import Privacy from "./pages/privacy";
import Navigation from "./components/navigation";
import { ErrorBoundary } from "react-error-boundary";

// Error fallback component
function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
        <p className="text-gray-600 mb-4">We're working on fixing this issue.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main>
          <Switch>
            {/* Main Pages */}
            <Route path="/" component={Landing} />
            <Route path="/search" component={Search} />
            <Route path="/destinations" component={Destinations} />
            <Route path="/destination/:slug" component={DestinationDetail} />
            
            {/* TripKits */}
            <Route path="/tripkits" component={TripKits} />
            <Route path="/tripkits/:kitId" component={TripKitDetail} />
            
            {/* Mt. Olympians */}
            <Route path="/mt-olympians" component={MtOlympians} />
            
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
    </ErrorBoundary>
  );
}