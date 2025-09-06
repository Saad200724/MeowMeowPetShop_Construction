
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Flame, Search, Grid3X3, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ProductCard from '@/components/ui/product-card';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import NavigationSidebar from '@/components/layout/sidebar';

export default function FlashSaleProducts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ['/api/products'],
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });

  // Filter products that are on sale
  const flashSaleProducts = (allProducts as any[]).filter((product: any) => product.isOnSale);

  // Filter products based on search query
  const filteredProducts = flashSaleProducts.filter((product: any) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NavigationSidebar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-8 px-4 bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Flame className="h-12 w-12" />
            <h1 className="text-4xl md:text-5xl font-bold">Flash Sale Products</h1>
          </div>
          <p className="text-xl opacity-90 mb-6">Limited time offers on premium pet products</p>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search flash sale products..."
              className="pl-10 bg-white text-gray-900"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold">
              All Flash Sale Products {!isLoading && `(${filteredProducts.length})`}
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-none h-10 px-3"
                >
                  <Grid3X3 size={16} />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-none h-10 px-3"
                >
                  <List size={16} />
                </Button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md h-80 animate-pulse">
                    <div className="bg-red-200 h-48 rounded-t-lg"></div>
                    <div className="p-4 space-y-2">
                      <div className="bg-gray-200 h-4 rounded"></div>
                      <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-lg text-red-600 font-medium animate-pulse">Loading flash sale products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <Card className="p-8">
              <div className="text-center">
                <Flame className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Flash Sale Products Found</h3>
                <p className="text-gray-500">
                  {searchQuery ? 'Try adjusting your search terms' : 'No flash sale products available at the moment.'}
                </p>
              </div>
            </Card>
          ) : (
            <div className={`grid gap-4 sm:gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {filteredProducts.map((product: any, index: number) => (
                <div 
                  key={product.id || product._id} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ProductCard 
                    product={product} 
                    className={viewMode === 'list' ? 'sm:flex sm:flex-row sm:h-48' : ''}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
