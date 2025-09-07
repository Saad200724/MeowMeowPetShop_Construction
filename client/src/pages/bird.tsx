import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import NavigationSidebar from '@/components/layout/sidebar';
import ProductCard from '@/components/product/product-card';
import AnalyticsBar from '@/components/product/analytics-bar';
import ModernFilter, { type FilterOptions } from '@/components/product/modern-filter';
import { useProducts, type Product } from '@/hooks/use-products';

export default function BirdPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [1, 20000],
    sortBy: 'relevance'
  });
  
  const { loading, error, getProductsByCategory } = useProducts()
  
  // Get dynamic products from API
  const allProducts = getProductsByCategory('bird');
  
  // Filter and sort products based on search, price range, and sort option
  const filteredProducts = allProducts
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (product.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      return matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'latest':
          return 0; // No createdAt available
        case 'a-z':
          return a.name.localeCompare(b.name);
        case 'z-a':
          return b.name.localeCompare(a.name);
        case 'price-high-low':
          return b.price - a.price;
        case 'price-low-high':
          return a.price - b.price;
        default:
          return 0;
      }
    });

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center pt-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading bird products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center pt-32">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading products: {error}</p>
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
      
      {/* Hero Section */}
      <section className="pt-24 pb-8 px-4 bg-gradient-to-r from-sky-500 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Bird Food & Accessories</h1>
          <p className="text-xl opacity-90 mb-6">Everything for your feathered companions</p>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search bird products..."
              className="pl-10 bg-white text-gray-900"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              data-testid="input-search-bird"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto lg:flex lg:gap-1">
          {/* Modern Filter Sidebar */}
          <aside className="lg:w-1/4 mb-8 lg:mb-0">
            <ModernFilter 
              onFilterChange={handleFilterChange}
              maxPrice={20000}
            />
          </aside>

          {/* Main Content Area */}
          <main className="lg:w-3/4">
            {/* Analytics Bar */}
            <AnalyticsBar categoryId="bird" />

            {/* Products Grid */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Bird Food & Accessories</h2>
                <p className="text-gray-600">{filteredProducts.length} products found</p>
              </div>

              {filteredProducts.length === 0 ? (
                <Card className="p-8">
                  <div className="text-center">
                    <p className="text-gray-500 mb-4">No products found</p>
                    <p className="text-sm text-gray-400">
                      {searchQuery ? 'Try adjusting your search terms' : 'Products coming soon!'}
                    </p>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </section>

      <Footer />
    </div>
  );
}