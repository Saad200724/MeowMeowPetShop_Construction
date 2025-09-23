
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import NavigationSidebar from '@/components/layout/sidebar';
import ProductCard from '@/components/product/product-card';
import AnalyticsBar from '@/components/product/analytics-bar';
import ModernFilter, { type FilterOptions } from '@/components/product/modern-filter';
import { useProducts } from '@/hooks/use-products';

export default function CatLitterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [1, 20000],
    sortBy: 'relevance'
  });

  // Use the API hook to get products
  const { products: allProducts, loading, error } = useProducts();

  // Filter products for cat-litter category
  const categoryProducts = allProducts.filter(product => 
    product.category === 'cat-litter' || 
    product.categoryName?.toLowerCase().includes('cat litter') ||
    product.tags?.some(tag => tag.toLowerCase().includes('cat-litter') || tag.toLowerCase().includes('litter'))
  );

  // Filter and sort products based on search, price range, and sort option
  const filteredProducts = categoryProducts
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           product.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      return matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'latest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
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
        <NavigationSidebar />
        <section className="pt-24 pb-8 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading cat litter products...</p>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <NavigationSidebar />
        <section className="pt-24 pb-8 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-red-600 mb-4">Error loading products: {error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NavigationSidebar />

      {/* Hero Section */}
      <section className="pt-24 pb-4 md:pb-8 px-4 bg-gradient-to-r from-gray-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4">Cat Litter & Accessories</h1>
          <p className="text-sm md:text-xl opacity-90 mb-4 md:mb-6">Everything you need for your cat's hygiene and comfort</p>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search cat litter products..."
              className="pl-10 bg-white text-gray-900"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              data-testid="input-search-cat-litter"
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

          {/* Products Grid */}
          <main className="lg:w-3/4">
            {/* Analytics Bar */}
            <AnalyticsBar categoryId="cat-litter" className="mb-6" />

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Cat Litter & Accessories</h2>
              <p className="text-gray-600">{filteredProducts.length} products found</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-1">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* No Products Message */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                <Button
                  variant="outline"
                  className="mt-4 text-gray-900 border-gray-400 bg-white hover:bg-gray-100 hover:border-gray-500 hover:text-black shadow-sm"
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({ priceRange: [1, 20000], sortBy: 'relevance' });
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </section>

      <Footer />
    </div>
  );
}
