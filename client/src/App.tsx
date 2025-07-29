import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import ProductsPage from "@/pages/products";
import PrivilegeClubPage from "@/pages/privilege-club";
import CatFoodPage from "@/pages/cat-food";
import DogFoodPage from "@/pages/dog-food";
import CatToysPage from "@/pages/cat-toys";
import CatLitterPage from "@/pages/cat-litter";
import ReflexPage from "@/pages/reflex";
import BlogPage from "@/pages/blog";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={ProductsPage} />
      <Route path="/privilege-club" component={PrivilegeClubPage} />
      <Route path="/cat-food" component={CatFoodPage} />
      <Route path="/dog-food" component={DogFoodPage} />
      <Route path="/cat-toys" component={CatToysPage} />
      <Route path="/cat-litter" component={CatLitterPage} />
      <Route path="/reflex" component={ReflexPage} />
      <Route path="/blog" component={BlogPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
