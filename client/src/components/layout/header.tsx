import { useState, useRef, useEffect } from 'react';
import { Search, User, ShoppingCart, Phone, Truck, Shield, Facebook, Instagram, LogOut, Menu, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { signOut } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/cart-context';
import { Link, useLocation } from 'wouter';
import { searchProducts, type SearchableProduct } from '@/lib/search-data';
const logoPath = '/logo.png';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchableProduct[]>([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const { state: cartState } = useCart();
  const [, setLocation] = useLocation();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Signed out successfully', description: 'Come back soon!' });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      const results = searchProducts(query);
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
    }
  };

  const handleSearchSelect = (product: SearchableProduct) => {
    setLocation(product.route);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigationItems = [
    { name: 'Home', path: '/' },
    { name: 'Privilege Club', path: '/privilege-club' },
    { name: 'Categories', path: '#', subItems: [
        { name: 'Cat Food', path: '/cat-food' },
        { name: 'Dog Food', path: '/dog-food' },
        { name: 'Cat Toys', path: '/cat-toys' },
        { name: 'Cat Litter', path: '/cat-litter' },
      ] },
    { name: 'Reflex Brand', path: '/reflex' },
    { name: 'Blog', path: '/blog' },
    { name: 'All Products', path: '/products' }
  ];

  return (
    <>
      {/* Top Announcement Bar - Will scroll away */}
      <div className="bg-[#38603d] text-white py-2 text-sm overflow-hidden relative z-30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center bg-[#2d4f31] px-3 py-1 rounded-full text-xs">
                <Phone size={12} className="mr-1" />
                <span>+880-1234-567890</span>
              </div>
              <div className="flex items-center bg-[#2d4f31] px-3 py-1 rounded-full text-xs">
                <Truck size={12} className="mr-1" />
                <span>Free delivery over ৳2000</span>
              </div>
              <div className="flex items-center bg-[#2d4f31] px-3 py-1 rounded-full text-xs">
                <Shield size={12} className="mr-1" />
                <span>Quality guarantee</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white font-medium text-xs">Follow:</span>
              <a href="#" className="text-white hover:text-black transition-colors p-1 rounded">
                <Facebook size={14} />
              </a>
              <a href="#" className="text-white hover:text-black transition-colors p-1 rounded">
                <Instagram size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - Fixed position below announcement bar */}
      <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-8">
            {/* Logo + Search */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:gap-8 w-full">
              <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
                <img src={logoPath} alt="Meow Meow Pet Shop Logo" className="h-10 w-10 mr-2" />
                <div>
                  <h1 className="text-lg font-bold text-[#26732d]">Meow Meow</h1>
                  <p className="text-xs text-gray-600">Pet Shop</p>
                </div>
              </Link>

              <div className="flex-1 mt-4 lg:mt-0" ref={searchRef}>
                <div className="relative">
                  <Input type="text" placeholder="Search for pet food, toys, accessories..." value={searchQuery} onChange={handleSearchChange} className="w-full py-2 px-4 pr-12 border-2 border-gray-200 rounded-lg focus:border-[#ffde59] focus:outline-none text-sm" data-testid="input-global-search" />
                  <Button size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#ffde59] text-black px-3 py-1 rounded-md hover:bg-[#ffd73e] transition-colors" data-testid="button-search">
                    <Search size={14} />
                  </Button>

                  {showSearchResults && searchResults.length > 0 && (
                    <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto">
                      <CardContent className="p-0">
                        {searchResults.map((product) => (
                          <div key={product.id} className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0" onClick={() => handleSearchSelect(product)} data-testid={`search-result-${product.id}`}>
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-sm">{product.name}</h4>
                                <p className="text-xs text-gray-600">{product.brand} • {product.category}</p>
                                <p className="text-xs text-blue-600">{product.page}</p>
                              </div>
                              <span className="text-sm font-bold text-green-600">{product.price}</span>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {showSearchResults && searchResults.length === 0 && searchQuery.trim() && (
                    <Card className="absolute top-full left-0 right-0 mt-1 z-50">
                      <CardContent className="p-4 text-center text-gray-500 text-sm">
                        No products found for "{searchQuery}"
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>

            {/* Account + Cart */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">Welcome, {user.email?.split('@')[0]}</span>
                  <Button variant="ghost" size="sm" className="text-gray-700 hover:text-[#26732d]" onClick={handleSignOut}>
                    <LogOut size={18} />
                    <span className="ml-1">Sign Out</span>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/sign-in">
                    <Button variant="ghost" size="sm" className="text-gray-700 hover:text-[#26732d]" data-testid="button-sign-in-desktop">
                      <User size={18} />
                      <span className="ml-1">Sign In</span>
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button variant="outline" size="sm" className="text-[#26732d] border-[#26732d] hover:bg-green-50" data-testid="button-sign-up-desktop">
                      <span>Sign Up</span>
                    </Button>
                  </Link>
                </div>
              )}
              <Link href="/cart">
                <Button variant="ghost" size="sm" className="text-gray-700 hover:text-[#26732d] relative" data-testid="button-cart">
                  <ShoppingCart size={18} />
                  <span className="ml-1">Cart</span>
                  {cartState.itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#ffde59] text-black text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                      {cartState.itemCount}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
          </div>

          <nav className="mt-4 border-t pt-4 relative">
            <div className="flex flex-wrap items-center gap-6">
              {navigationItems.map((item) => (
                <div key={item.name} className="relative group">
                  {item.subItems ? (
                    <div>
                      <Button variant="ghost" className="text-gray-700 hover:text-[#26732d] font-medium flex items-center gap-1" data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}>
                        {item.name}
                        <ChevronDown size={16} />
                      </Button>
                      <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-lg border py-2 min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        {item.subItems.map((subItem) => (
                          <Link key={subItem.name} href={subItem.path} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#26732d] transition-colors" data-testid={`nav-sub-${subItem.name.toLowerCase().replace(/\s+/g, '-')}`}>
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link href={item.path}>
                      <Button variant="ghost" className="text-gray-700 hover:text-[#26732d] font-medium" data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}>
                        {item.name}
                      </Button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </nav>
        </div>
      </header>


    </>
  );
}
