import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, Search, Filter } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import NavigationSidebar from '@/components/layout/sidebar';
import ProductCard from '@/components/ui/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSidebar } from '@/contexts/sidebar-context';

export default function NewlyLaunchedProducts() {
  const { isVisible: sidebarVisible } = useSidebar();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filter, setFilter] = useState('all');

  // Fast API query with optimized settings
  const { data: allProducts = [], isLoading, error } = useQuery({
    queryKey: ['/api/products'],
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Optimized filtering with useMemo
  const newlyLaunchedProducts = useMemo(() => {
    if (!Array.isArray(allProducts)) return [];
    return allProducts
      .filter((product: any) => product.isNew)
      .filter((product: any) => {
        // Filter by search query
        if (searchQuery && !product.name?.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        // Filter by category
        if (filter === 'cats' && !product.category?.includes('cat')) return false;
        if (filter === 'dogs' && !product.category?.includes('dog')) return false;
        return true;
      })
      .sort((a: any, b: any) => {
        switch (sortBy) {
          case 'price-low':
            return (a.price || 0) - (b.price || 0);
          case 'price-high':
            return (b.price || 0) - (a.price || 0);
          case 'name':
            return (a.name || '').localeCompare(b.name || '');
          default:
            return 0;
        }
      });
  }, [allProducts, searchQuery, sortBy, filter]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center pt-32">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load products</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NavigationSidebar />
      
      <main className={`transition-all duration-300 ${sidebarVisible ? 'md:ml-80' : 'md:ml-0'} overflow-x-hidden pb-20 md:pb-0`}>
        {/* Hero Section */}
        <section className="pt-24 pb-8 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="h-10 w-10" />
              <h1 className="text-3xl md:text-4xl font-bold">Newly Launched</h1>
            </div>
            <p className="text-lg opacity-90 mb-6">Discover the latest additions to our pet product collection</p>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-6 px-4 bg-white border-b">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search new products..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="cats">Cat Products</SelectItem>
                  <SelectItem value="dogs">Dog Products</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md h-80 animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-t-lg"></div>
                    <div className="p-4 space-y-2">
                      <div className="bg-gray-200 h-4 rounded"></div>
                      <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : newlyLaunchedProducts.length === 0 ? (
              <div className="text-center py-12">
                <Sparkles className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  {searchQuery ? 'No products found' : 'No newly launched products available'}
                </h3>
                <p className="text-gray-500">
                  {searchQuery ? 'Try adjusting your search terms' : 'Check back later for new arrivals!'}
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-lg font-medium text-gray-700">
                    {newlyLaunchedProducts.length} newly launched {newlyLaunchedProducts.length === 1 ? 'product' : 'products'} found
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                  {newlyLaunchedProducts.map((product: any) => (
                    <div key={product.id || product._id} className="relative">
                      <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1 z-10">
                        <Sparkles size={12} />
                        JUST IN
                      </div>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}