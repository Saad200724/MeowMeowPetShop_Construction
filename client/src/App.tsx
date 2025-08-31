import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { CartProvider } from "@/contexts/cart-context";
import ScrollToTop from "@/components/scroll-to-top";
import NotFoundPage from "@/pages/not-found";
import Home from "@/pages/home";
import ProductsPage from "@/pages/products";
import PrivilegeClubPage from "@/pages/privilege-club";

import CatFoodPage from "@/pages/cat-food";
import DogFoodPage from "@/pages/dog-food";
import CatToysPage from "@/pages/cat-toys";
import CatLitterPage from "@/pages/cat-litter";
import CatCarePage from "@/pages/cat-care";
import ClothingBedsCarrierPage from "@/pages/clothing-beds-carrier";
import CatAccessoriesPage from "@/pages/cat-accessories";
import DogAccessoriesPage from "@/pages/dog-accessories";
import RabbitPage from "@/pages/rabbit";
import BirdPage from "@/pages/bird";
import ReflexPage from "@/pages/reflex";
import BlogPage from "@/pages/blog";
import BulkProductsPage from "@/pages/bulk-products";
import BulkDiscountsPage from "@/pages/bulk-discounts";
import NekkoPage from "@/pages/brands/nekko";
import PurinaPage from "@/pages/brands/purina";
import OnePage from "@/pages/brands/one";
import ReflexPlusPage from "@/pages/brands/reflex-plus";
import RoyalCaninPage from "@/pages/brands/royal-canin";
import ShebaPage from "@/pages/brands/sheba";
import SignInPage from "@/pages/sign-in";
import SignUpPage from "@/pages/sign-up";
import ForgotPasswordPage from "@/pages/forgot-password";
import ResetPasswordPage from "@/pages/reset-password";

import AdminPage from "@/pages/admin";
import DashboardPage from "@/pages/dashboard";
import CartPage from "@/pages/cart";
import CheckoutPage from "@/pages/checkout";
import InvoicePage from "@/pages/invoice";
import ProfilePage from "@/pages/profile";
import MessengerPage from "@/pages/messenger";
import ContactPage from "@/pages/contact";
import { SidebarProvider } from "@/contexts/sidebar-context";
import { FloatingCart } from "@/components/ui/floating-cart";

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/products" component={ProductsPage} />
        <Route path="/privilege-club" component={PrivilegeClubPage} />
        <Route path="/cat-food" component={CatFoodPage} />
        <Route path="/dog-food" component={DogFoodPage} />
        <Route path="/cat-toys" component={CatToysPage} />
        <Route path="/cat-litter" component={CatLitterPage} />
        <Route path="/cat-care" component={CatCarePage} />
        <Route path="/cat-accessories" component={CatAccessoriesPage} />
        <Route path="/clothing-beds-carrier" component={ClothingBedsCarrierPage} />
        <Route path="/dog-accessories" component={DogAccessoriesPage} />
        <Route path="/rabbit" component={RabbitPage} />
        <Route path="/bird" component={BirdPage} />
        <Route path="/brands/reflex" component={ReflexPage} />
        <Route path="/brands/nekko" component={NekkoPage} />
        <Route path="/brands/purina" component={PurinaPage} />
        <Route path="/brands/one" component={OnePage} />
        <Route path="/brands/reflex-plus" component={ReflexPlusPage} />
        <Route path="/brands/royal-canin" component={RoyalCaninPage} />
        <Route path="/brands/sheba" component={ShebaPage} />
        <Route path="/blog" component={BlogPage} />
        <Route path="/bulk-products" component={BulkProductsPage} />
        <Route path="/bulk-discounts" component={BulkDiscountsPage} />
        <Route path="/sign-in" component={SignInPage} />
        <Route path="/sign-up" component={SignUpPage} />
        <Route path="/forgot-password" component={ForgotPasswordPage} />
        <Route path="/reset-password" component={ResetPasswordPage} />

        <Route path="/admin" component={AdminPage} />
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/cart" component={CartPage} />
        <Route path="/checkout" component={CheckoutPage} />
        <Route path="/invoice/:invoiceId" component={InvoicePage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/messenger" component={MessengerPage} />
        <Route path="/contact" component={ContactPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <SidebarProvider>
              <div className="min-h-screen bg-white">
                <Router />
                <FloatingCart />
                <Toaster />
              </div>
            </SidebarProvider>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;