import { useState } from "react";
import { Search, ShoppingCart, User, Menu, Phone, MapPin, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();

  return (
    <div>
      {/* Top Bar */}
      <div className="bg-accent-green text-white py-2 text-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              01408076089
            </span>
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Our location
            </span>
            <span className="flex items-center">
              <Truck className="w-4 h-4 mr-2" />
              Track Your Order
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <a href="#" className="hover:text-primary-yellow transition-colors">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" className="hover:text-primary-yellow transition-colors">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="hover:text-primary-yellow transition-colors">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="hover:text-primary-yellow transition-colors">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img 
                src="/logo.png" 
                alt="Meow Meow Pet Shop Logo" 
                className="h-12 w-12 rounded-full object-cover border-2 border-accent-green"
              />
              <h1 className="text-2xl font-bold text-accent-green hidden sm:block">
                Meow Meow Pet Shop
              </h1>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8 hidden md:block">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search for pet products..."
                  className="w-full pr-10"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-accent-green"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="hidden md:flex items-center space-x-2 text-gray-700 hover:text-accent-green">
                <User className="w-4 h-4" />
                <span>Hello User</span>
              </Button>
              <Button className="relative bg-primary-yellow hover:bg-yellow-400 text-gray-900">
                <ShoppingCart className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">My Basket</span>
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center p-0">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <Button
                variant="default"
                className="md:hidden bg-accent-green text-white hover:bg-green-700"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="w-4 h-4 mr-2" />
                Browse Categories
              </Button>
              <ul className="hidden md:flex space-x-8">
                <li>
                  <a href="#" className="text-gray-700 hover:text-accent-green font-medium transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-700 hover:text-accent-green font-medium transition-colors">
                    Privilege Club
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-700 hover:text-accent-green font-medium transition-colors">
                    Cat Food
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-700 hover:text-accent-green font-medium transition-colors">
                    Dog Food
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-700 hover:text-accent-green font-medium transition-colors">
                    Cat Toys
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-700 hover:text-accent-green font-medium transition-colors">
                    Cat Litter
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-700 hover:text-accent-green font-medium transition-colors">
                    Reflex
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-700 hover:text-accent-green font-medium transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </header>
    </div>
  );
}
