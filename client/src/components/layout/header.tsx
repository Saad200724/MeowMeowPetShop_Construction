import { useState, useRef, useEffect } from 'react';
import { Search, User, ShoppingCart, Phone, Truck, Shield, Facebook, Instagram, LogOut, Menu, ChevronDown, LogIn, Speaker } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/cart-context';
import { useSidebar } from '@/contexts/sidebar-context';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { type SearchableProduct } from '@/lib/search-data';
const logoPath = '/logo.png';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchableProduct[]>([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const searchRef = useRef<HTMLDivElement>(null);
  const { user, signOut: authSignOut, loading } = useAuth();
  const { toast } = useToast();
  const { state: cartState } = useCart();
  const { toggle: toggleSidebar } = useSidebar();
  const [, setLocation] = useLocation();

  // Fetch current announcement
  const { data: announcements } = useQuery({
    queryKey: ['/api/announcements'],
    queryFn: async () => {
      const response = await fetch('/api/announcements');
      if (!response.ok) throw new Error('Failed to fetch announcements');
      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const currentAnnouncement = announcements?.[0];

  // Function to parse bold text formatting
  const parseAnnouncementText = (text: string) => {
    if (!text) return text;

    // Replace **text** with bold
    let parsed = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // Replace *text* with bold
    parsed = parsed.replace(/\*([^*]+)\*/g, '<strong>$1</strong>');

    return parsed;
  };

  const handleSignOut = async () => {
    try {
      await authSignOut();
      toast({ title: 'Signed out successfully', description: 'Come back soon!' });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({ title: 'Error', description: 'Failed to sign out', variant: 'destructive' });
    }
  };

  // Fetch products for search
  const { data: allProducts = [] } = useQuery({
    queryKey: ['/api/products'],
  });

  // Shop by Category items that should be searchable
  const shopByCategoryItems: SearchableProduct[] = [
    { id: 'adult-food', name: 'Adult Food', category: 'Adult Food', brand: 'Various', price: '৳1,200+', page: 'Shop by Category', route: '/products?category=adult-food', keywords: ['adult', 'food', 'premium', 'quality'] },
    { id: 'kitten-food', name: 'Kitten Food', category: 'Kitten Food', brand: 'Various', price: '৳800+', page: 'Shop by Category', route: '/products?category=kitten-food', keywords: ['kitten', 'food', 'growing', 'nutrition'] },
    { id: 'collar', name: 'Collar', category: 'Collar', brand: 'Various', price: '৳300+', page: 'Shop by Category', route: '/products?category=collar', keywords: ['collar', 'style', 'safety'] },
    { id: 'clumping-cat-litter', name: 'Clumping Cat Litter', category: 'Clumping Cat Litter', brand: 'Various', price: '৳600+', page: 'Shop by Category', route: '/products?category=clumping-cat-litter', keywords: ['clumping', 'cat', 'litter', 'easy', 'clean'] },
    { id: 'cat-litter-accessories', name: 'Cat Litter Accessories', category: 'Cat Litter Accessories', brand: 'Various', price: '৳200+', page: 'Shop by Category', route: '/products?category=cat-litter-accessories', keywords: ['cat', 'litter', 'accessories', 'complete', 'care'] },
    { id: 'harness', name: 'Harness', category: 'Harness', brand: 'Various', price: '৳500+', page: 'Shop by Category', route: '/products?category=harness', keywords: ['harness', 'secure', 'walking'] },
    { id: 'cat-tick-flea-control', name: 'Cat Tick & Flea Control', category: 'Cat Tick & Flea Control', brand: 'Various', price: '৳400+', page: 'Shop by Category', route: '/products?category=cat-tick-flea-control', keywords: ['cat', 'tick', 'flea', 'control', 'health', 'protection'] },
    { id: 'deworming-tablet', name: 'Deworming Tablet', category: 'Deworming Tablet', brand: 'Various', price: '৳250+', page: 'Shop by Category', route: '/products?category=deworming-tablet', keywords: ['deworming', 'tablet', 'wellness', 'care'] },
    { id: 'cat-pouches', name: 'Cat Pouches', category: 'Cat Pouches', brand: 'Various', price: '৳150+', page: 'Shop by Category', route: '/products?category=cat-pouches', keywords: ['cat', 'pouches', 'wet', 'food'] },
    { id: 'sunglass', name: 'Sunglass', category: 'Sunglass', brand: 'Various', price: '৳800+', page: 'Shop by Category', route: '/products?category=sunglass', keywords: ['sunglass', 'pet', 'fashion'] }
  ];

  const searchAllProducts = (query: string): SearchableProduct[] => {
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase().trim();
    const results: SearchableProduct[] = [];
    
    // Search through real products from API
    (allProducts as any[]).forEach(product => {
      const searchableText = [
        product.name,
        product.categoryName || product.category,
        product.brandName || product.brand,
        product.description || '',
        ...(product.tags || [])
      ].join(' ').toLowerCase();
      
      if (searchableText.includes(searchTerm)) {
        // Use slug for the route if available, otherwise use id
        const productSlug = product.slug || product.id || product._id;
        results.push({
          id: product.id || product._id,
          name: product.name,
          category: product.categoryName || product.category,
          brand: product.brandName || product.brand,
          price: `৳${product.price}`,
          page: product.categoryName || product.category,
          route: `/product/${productSlug}`,
          keywords: product.tags || []
        });
      }
    });
    
    // Search through Shop by Category items
    shopByCategoryItems.forEach(item => {
      const searchableText = [
        item.name,
        item.category,
        item.brand || '',
        ...item.keywords
      ].join(' ').toLowerCase();
      
      if (searchableText.includes(searchTerm)) {
        results.push(item);
      }
    });
    
    return results.slice(0, 10); // Limit to 10 results
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      const results = searchAllProducts(query);
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
    }
  };

  const handleSearchSelect = (route: string) => {
    console.log('Search select clicked, navigating to:', route);
    // Navigate immediately
    setLocation(route);
    // Then close search and clear query
    setTimeout(() => {
      setSearchQuery('');
      setShowSearchResults(false);
    }, 100);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is on a search result link
      const target = event.target as HTMLElement;
      const isSearchResultClick = target.closest('[data-testid^="search-result-"]');
      
      if (searchRef.current && !searchRef.current.contains(event.target as Node) && !isSearchResultClick) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keep announcement bar always visible - no scroll hiding behavior

  const navigationItems = [
    { name: 'Home', path: '/' },
    { name: 'Privilege Club', path: '/privilege-club' },
    { name: 'Cat Food', path: '/cat-food' },
    { name: 'Dog Food', path: '/dog-food' },
    { name: 'Cat Toys', path: '/cat-toys' },
    { name: 'Cat Litter', path: '/cat-litter' },
    { name: 'Bird', path: '/bird' },
    { name: 'Rabbit', path: '/rabbit' },
    { name: 'Reflex', path: '/brands/reflex' },
    { name: 'Blog', path: '/blog' }
  ];

  const categories = [
    { label: 'Cat Food', href: '/cat-food', hasSubCategories: true },
    { label: 'Cat Toys', href: '/cat-toys', hasSubCategories: false },
    { label: 'Cat Litter', href: '/cat-litter', hasSubCategories: true },
    { label: 'Cat Care & Health', href: '/cat-care', hasSubCategories: false },
    { label: 'Clothing, Beds & Carrier', href: '/cat-accessories', hasSubCategories: true },
    { label: 'Cat Accessories', href: '/cat-accessories', hasSubCategories: true },
    { label: 'Dog Health & Accessories', href: '/dog-accessories', hasSubCategories: true },
    { label: 'Dog Food', href: '/dog-food', hasSubCategories: true },
    { label: 'Rabbit Food & Accessories', href: '/rabbit', hasSubCategories: true },
    { label: 'Bird Food & Accessories', href: '/bird', hasSubCategories: true },
  ];

  return (
    <>
      {/* Top Announcement Bar - Thin for mobile */}
      <div className="bg-[#38603d] text-white py-1 md:py-2 text-sm overflow-hidden relative">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Mobile: Only announcement and social media */}
            <div className="md:hidden flex-1 flex justify-center items-center relative min-h-[20px] overflow-hidden">
              {currentAnnouncement && (
                <div className="animate-marquee whitespace-nowrap absolute inset-0 flex items-center" style={{ width: 'max-content' }}>
                  <div className="inline-flex items-center text-white text-xs font-medium">
                    <Speaker size={10} className="mr-1" />
                    <span dangerouslySetInnerHTML={{ __html: parseAnnouncementText(currentAnnouncement.text) }} />
                  </div>
                </div>
              )}
            </div>
            
            {/* Mobile: Social media icons only */}
            <div className="md:hidden flex items-center gap-1">
              <a href="https://facebook.com/meow.meow.pet.shop1" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-300 transition-colors p-1 rounded">
                <Facebook size={12} />
              </a>
              <a href="https://www.instagram.com/meow_meow_pet_shop" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-300 transition-colors p-1 rounded">
                <Instagram size={12} />
              </a>
            </div>
            
            {/* Desktop: Full layout */}
            <div className="hidden md:flex flex-col lg:flex-row lg:justify-between lg:items-center gap-2 w-full">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center bg-[#2d4f31] px-3 py-1 rounded-full text-xs">
                  <Phone size={12} className="mr-1" />
                  <span>01405-045023</span>
                </div>
                <Link href="/contact">
                  <div className="flex items-center bg-[#2d4f31] px-3 py-1 rounded-full text-xs cursor-pointer hover:bg-[#224228] transition-colors">
                    <Truck size={12} className="mr-1" />
                    <span>Our location</span>
                  </div>
                </Link>
                <div className="flex items-center bg-[#2d4f31] px-3 py-1 rounded-full text-xs cursor-pointer hover:bg-[#224228] transition-colors">
                  <Shield size={12} className="mr-1" />
                  <span>Track Your Order</span>
                </div>
              </div>

              {/* Desktop Announcement */}
              <div className="flex-1 flex justify-center items-center relative min-h-[24px] overflow-hidden">
                {currentAnnouncement && (
                  <div className="animate-marquee whitespace-nowrap absolute inset-0 flex items-center" style={{ width: 'max-content' }}>
                    <div className="inline-flex items-center text-white text-xs font-medium">
                      <Speaker size={12} className="mr-2" />
                      <span dangerouslySetInnerHTML={{ __html: parseAnnouncementText(currentAnnouncement.text) }} />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-white font-medium text-xs">Follow:</span>
                <a href="https://facebook.com/meow.meow.pet.shop1" target="_blank" rel="noopener noreferrer" className="text-white hover:text-black transition-colors p-1 rounded">
                  <Facebook size={14} />
                </a>
                <a href="https://www.instagram.com/meow_meow_pet_shop" target="_blank" rel="noopener noreferrer" className="text-white hover:text-black transition-colors p-1 rounded">
                  <Instagram size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - Mobile optimized */}
      <header className="bg-white shadow-md sticky top-0 z-[1000] border-b border-gray-200 transition-all duration-300 w-full">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-3 md:gap-4">
            {/* Mobile: Hamburger + Logo + Cart */}
            <div className="md:hidden flex items-center justify-between w-full">
              {/* Hamburger Menu */}
              <Button 
                variant="ghost" 
                size="sm"
                className="p-2 hover:bg-gray-100"
                onClick={toggleSidebar}
                data-testid="button-mobile-menu"
              >
                <Menu size={20} className="text-gray-700" />
              </Button>
              
              {/* Logo */}
              <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
                <img src={logoPath} alt="Meow Meow Pet Shop Logo" className="h-8 w-8 mr-2" />
                <div>
                  <h1 className="text-base font-bold text-[#26732d]">Meow Meow</h1>
                  <p className="text-xs text-gray-600">Pet Shop</p>
                </div>
              </Link>
              
              {/* Cart */}
              <Link href="/cart">
                <div className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer" data-testid="button-cart-mobile">
                  <ShoppingCart size={20} className="text-gray-700" />
                  {cartState.items.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {cartState.items.reduce((total, item) => total + item.quantity, 0)}
                    </span>
                  )}
                </div>
              </Link>
            </div>
            
            {/* Desktop: Logo + Search + Account + Cart */}
            <div className="hidden md:flex md:flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-8 w-full">
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
                    <Input 
                      type="text" 
                      placeholder="Search for pet food, toys, accessories..." 
                      value={searchQuery} 
                      onChange={handleSearchChange} 
                      className="w-full py-2 px-4 pr-12 border-2 border-gray-200 rounded-lg focus:border-[#ffde59] focus:outline-none text-sm text-black" 
                      data-testid="input-global-search" 
                    />
                    <Button 
                      size="sm" 
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#ffde59] text-black px-3 py-1 rounded-md hover:bg-[#ffd73e] transition-colors" 
                      data-testid="button-search"
                    >
                      <Search size={14} />
                    </Button>

                  {showSearchResults && searchResults.length > 0 && (
                    <Card className="absolute top-full left-0 right-0 mt-1 z-[9999] max-h-96 overflow-y-auto">
                      <CardContent className="p-0">
                        {searchResults.map((product) => (
                          <Link 
                            key={product.id} 
                            href={product.route}
                            onClick={(e) => {
                              e.stopPropagation();
                              setTimeout(() => {
                                setSearchQuery('');
                                setShowSearchResults(false);
                              }, 100);
                            }}
                          >
                            <div 
                              className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0" 
                              data-testid={`search-result-${product.id}`}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium text-sm">{product.name}</h4>
                                  <p className="text-xs text-gray-600">{product.brand} • {product.category}</p>
                                  <p className="text-xs text-blue-600">{product.page}</p>
                                </div>
                                <span className="text-sm font-bold text-green-600">{product.price}</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {showSearchResults && searchResults.length === 0 && searchQuery.trim() && (
                    <Card className="absolute top-full left-0 right-0 mt-1 z-[9999]">
                      <CardContent className="p-4 text-center text-gray-500 text-sm">
                        No products found for "{searchQuery}"
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>

              {/* Account + Cart - Desktop only */}
              <div className="flex items-center space-x-4">
                {!loading && user ? (
                  <div className="flex items-center space-x-3">
                    {/* Circular Avatar */}
                    <div className="relative group">
                      <Link href={user.email === 'admin@meowmeowpetshop.com' ? '/admin' : '/dashboard'}>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#26732d] to-[#1d5624] flex items-center justify-center text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105">
                          {(user.firstName?.[0] || user.name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                        </div>
                      </Link>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                        {user.firstName && user.lastName 
                          ? `${user.firstName} ${user.lastName}` 
                          : user.name || user.email?.split('@')[0]}
                        <div className="text-xs opacity-75 mt-1">
                          {user.email === 'admin@meowmeowpetshop.com' ? 'Click to view admin panel' : 'Click to view dashboard'}
                        </div>
                      </div>
                    </div>

                    {/* Sign Out Button */}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleSignOut} 
                      className="text-red-600 border-red-200 hover:bg-gray-100 hover:text-black hover:border-gray-300 transition-colors"
                      data-testid="button-sign-out"
                    >
                      <LogOut size={14} className="mr-1" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link href="/sign-in">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-[#26732d] border-[#26732d] hover:bg-[#26732d] hover:text-white transition-colors"
                        data-testid="button-sign-in"
                      >
                        <LogIn size={14} className="mr-1" />
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/sign-up">
                      <Button 
                        size="sm" 
                        className="bg-[#ffde59] text-[#010000] hover:bg-[#ffd73e] hover:text-[#010000] transition-colors font-semibold"
                        data-testid="button-sign-up"
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Cart - Desktop */}
                <Link href="/cart">
                  <div className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer" data-testid="button-cart">
                    <ShoppingCart size={20} className="text-gray-700" />
                    {cartState.items.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                        {cartState.items.reduce((total, item) => total + item.quantity, 0)}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu - Desktop only */}
        <nav className="hidden md:block border-t border-gray-100 bg-gray-50 relative z-[100]">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center space-x-6 overflow-x-auto scrollbar-hide">
              {/* Categories Toggle */}
              <div className="flex-shrink-0">
                <Button 
                  variant="ghost" 
                  className="text-gray-700 hover:text-[#f8fbfc] font-medium flex items-center gap-1 bg-gray-50"
                  onClick={toggleSidebar}
                  data-testid="button-categories-toggle"
                >
                  <Menu size={16} />
                  Categories
                </Button>
              </div>

              {/* Main Navigation Items */}
              {navigationItems.map((item) => (
                <div key={item.name} className="relative group">
                  <Link href={item.path}>
                    <Button 
                      variant="ghost" 
                      className="text-gray-700 hover:text-[#f8fbfc] font-medium" 
                      data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {item.name}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </nav>
        
        {/* Mobile Search Bar */}
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3" ref={searchRef}>
          <div className="relative">
            <Input 
              type="text" 
              placeholder="What can we help you find?" 
              value={searchQuery} 
              onChange={handleSearchChange} 
              className="w-full py-2 px-4 pr-12 border-2 border-gray-200 rounded-lg focus:border-[#ffde59] focus:outline-none text-sm text-black" 
              data-testid="input-mobile-search" 
            />
            <Button 
              size="sm" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#ffde59] text-black px-3 py-1 rounded-md hover:bg-[#ffd73e] transition-colors" 
              data-testid="button-mobile-search"
            >
              <Search size={14} />
            </Button>

            {showSearchResults && searchResults.length > 0 && (
              <Card className="absolute top-full left-0 right-0 mt-1 z-[9999] max-h-96 overflow-y-auto">
                <CardContent className="p-0">
                  {searchResults.map((product) => (
                    <Link 
                      key={product.id} 
                      href={product.route}
                      onClick={(e) => {
                        e.stopPropagation();
                        setTimeout(() => {
                          setSearchQuery('');
                          setShowSearchResults(false);
                        }, 100);
                      }}
                    >
                      <div 
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0" 
                        data-testid={`search-result-${product.id}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-sm">{product.name}</h4>
                            <p className="text-xs text-gray-600">{product.brand} • {product.category}</p>
                            <p className="text-xs text-blue-600">{product.page}</p>
                          </div>
                          <span className="text-sm font-bold text-green-600">{product.price}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}

            {showSearchResults && searchResults.length === 0 && searchQuery.trim() && (
              <Card className="absolute top-full left-0 right-0 mt-1 z-[9999]">
                <CardContent className="p-4 text-center text-gray-500 text-sm">
                  No products found for "{searchQuery}"
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Mobile Mini Navigation */}
        <div className="md:hidden bg-gray-50 border-t border-gray-100 px-2 py-2">
          <div className="flex items-center justify-between overflow-x-auto scrollbar-hide">
            <Link href="/cat-food" className="flex-shrink-0 px-3 py-1 text-xs font-medium text-gray-700 hover:text-[#26732d] hover:bg-white rounded transition-colors">
              Cat Food
            </Link>
            <Link href="/dog-food" className="flex-shrink-0 px-3 py-1 text-xs font-medium text-gray-700 hover:text-[#26732d] hover:bg-white rounded transition-colors">
              Dog Food
            </Link>
            <Link href="/cat-toys" className="flex-shrink-0 px-3 py-1 text-xs font-medium text-gray-700 hover:text-[#26732d] hover:bg-white rounded transition-colors">
              Cat Toys
            </Link>
            <Link href="/cat-litter" className="flex-shrink-0 px-3 py-1 text-xs font-medium text-gray-700 hover:text-[#26732d] hover:bg-white rounded transition-colors">
              Cat Litter
            </Link>
            <Link href="/cat-accessories" className="flex-shrink-0 px-3 py-1 text-xs font-medium text-gray-700 hover:text-[#26732d] hover:bg-white rounded transition-colors">
              Cat Accessories
            </Link>
            <Link href="/rabbit" className="flex-shrink-0 px-3 py-1 text-xs font-medium text-gray-700 hover:text-[#26732d] hover:bg-white rounded transition-colors">
              Rabbit
            </Link>
            <Link href="/bird" className="flex-shrink-0 px-3 py-1 text-xs font-medium text-gray-700 hover:text-[#26732d] hover:bg-white rounded transition-colors">
              Bird
            </Link>
            <Link href="/brands/reflex" className="flex-shrink-0 px-3 py-1 text-xs font-medium text-gray-700 hover:text-[#26732d] hover:bg-white rounded transition-colors">
              Reflex
            </Link>
            <Link href="/blog" className="flex-shrink-0 px-3 py-1 text-xs font-medium text-gray-700 hover:text-[#26732d] hover:bg-white rounded transition-colors">
              Blog
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}