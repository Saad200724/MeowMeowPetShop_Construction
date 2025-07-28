import { useState } from 'react';
import { Search, User, ShoppingCart, Phone, Truck, Shield, Facebook, Instagram, Youtube, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { signOut } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import AuthModal from '@/components/auth/auth-modal';
import { Link } from 'wouter';
import logoPath from '@assets/logo_1753447667081.png';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, loading } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Signed out successfully',
        description: 'Come back soon!',
      });
    }
  };

  return (
    <>
      {/* Top Header Strip */}
      <div className="bg-[#26732d] text-white py-2 text-sm overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center bg-[#1e5d26] px-3 py-1 rounded-full text-xs">
                <Phone size={12} className="mr-1" />
                <span>+880-1234-567890</span>
              </div>
              <div className="flex items-center bg-[#1e5d26] px-3 py-1 rounded-full text-xs">
                <Truck size={12} className="mr-1" />
                <span>Free delivery over ৳2000</span>
              </div>
              <div className="flex items-center bg-[#1e5d26] px-3 py-1 rounded-full text-xs">
                <Shield size={12} className="mr-1" />
                <span>Quality guarantee</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#ffde59] font-medium text-xs">Follow:</span>
              <a href="#" className="hover:text-[#ffde59] transition-colors p-1 rounded">
                <Facebook size={14} />
              </a>
              <a href="#" className="hover:text-[#ffde59] transition-colors p-1 rounded">
                <Instagram size={14} />
              </a>
              <a href="#" className="hover:text-[#ffde59] transition-colors p-1 rounded">
                <Youtube size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
            {/* Logo */}
            <div className="flex items-center justify-between lg:justify-start">
              <div className="flex items-center">
                <img src={logoPath} alt="Meow Meow Pet Shop Logo" className="h-10 w-10 mr-2" />
                <div>
                  <h1 className="text-lg font-bold text-[#26732d]">Meow Meow</h1>
                  <p className="text-xs text-gray-600">Pet Shop</p>
                </div>
              </div>
              
              {/* Mobile User Actions */}
              <div className="flex items-center space-x-2 lg:hidden">
                {user ? (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-700 hover:text-[#26732d]"
                    onClick={handleSignOut}
                  >
                    <LogOut size={18} />
                  </Button>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-700 hover:text-[#26732d]"
                    onClick={() => setShowAuthModal(true)}
                  >
                    <User size={18} />
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="text-gray-700 hover:text-[#26732d] relative">
                  <ShoppingCart size={18} />
                  <span className="absolute -top-1 -right-1 bg-[#ffde59] text-black text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">3</span>
                </Button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Input 
                  type="text" 
                  placeholder="Search for pet food, toys, accessories..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2 px-4 pr-12 border-2 border-gray-200 rounded-lg focus:border-[#ffde59] focus:outline-none text-sm"
                />
                <Button 
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#ffde59] text-black px-3 py-1 rounded-md hover:bg-[#ffd73e] transition-colors"
                >
                  <Search size={14} />
                </Button>
              </div>
            </div>

            {/* Desktop User Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-700">Hello, {user.email}</span>
                  <Button 
                    variant="ghost" 
                    className="flex items-center text-gray-700 hover:text-[#26732d] transition-colors"
                    onClick={handleSignOut}
                  >
                    <LogOut size={16} className="mr-2" />
                    <span>Sign Out</span>
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="ghost" 
                  className="flex items-center text-gray-700 hover:text-[#26732d] transition-colors"
                  onClick={() => setShowAuthModal(true)}
                >
                  <User size={16} className="mr-2" />
                  <span>Sign In</span>
                </Button>
              )}
              <Button variant="ghost" className="flex items-center text-gray-700 hover:text-[#26732d] relative transition-colors">
                <ShoppingCart size={16} className="mr-2" />
                <span>Cart</span>
                <span className="absolute -top-2 -right-2 bg-[#ffde59] text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">3</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Navigation */}
      <nav className="bg-[#26732d] text-white py-3 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center lg:justify-start">
            <div className="flex items-center space-x-6 lg:space-x-8 text-sm lg:text-base overflow-x-auto">
              <Link href="/" className="hover:bg-[#1e5d26] px-3 py-2 rounded-md transition-colors whitespace-nowrap">Home</Link>
              <Link href="/products" className="hover:bg-[#1e5d26] px-3 py-2 rounded-md transition-colors whitespace-nowrap">Products</Link>
              <a href="#" className="hover:bg-[#1e5d26] px-3 py-2 rounded-md transition-colors whitespace-nowrap">About</a>
              <a href="#" className="hover:bg-[#1e5d26] px-3 py-2 rounded-md transition-colors whitespace-nowrap">Contact</a>
              <a href="#" className="hover:bg-[#1e5d26] px-3 py-2 rounded-md transition-colors whitespace-nowrap">Sale</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
