import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import NavigationSidebar from '@/components/layout/sidebar';
import ProductCard from '@/components/product/product-card';
import AnalyticsBar from '@/components/product/analytics-bar';
import { useProducts, type Product } from '@/hooks/use-products';

const catAccessoriesCategories = [
  'Collars',
  'Harnesses',
  'Cat Tags',
  'Leashes',
  'Feeding Bowls',
  'Water Fountains',
  'Cat Trees',
  'Scratching Posts',
  'Cat Tunnels',
  'Interactive Toys',
  'Sunglasses',
  'Bandanas'
];

export default function CatAccessoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { loading, error, getProductsByCategory } = useProducts()
  
  // Get dynamic products from API
  const allProducts = getProductsByCategory('cat-accessories');
  
  // Filter products based on search and category
  const filteredProducts = allProducts.filter(product => {
    const matchesCategory = selectedCategory === 'All';
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (product.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
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
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading cat accessories...</p>
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
      <section className="pt-6 pb-6 px-4 md:pt-10 md:pb-10 md:px-8 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-2 md:mb-4 text-white">
            Cat Accessories
          </h1>
          <p className="text-sm md:text-lg mb-4 md:mb-6 text-white">
            Everything your cat needs for a perfect life
          </p>
          
          {/* Search Bar */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search cat accessories..."
              className="h-10 sm:h-11 rounded-full pl-11 pr-4 text-sm bg-white text-gray-900 shadow-md border-0 focus:ring-2 focus:ring-cyan-400 placeholder:text-gray-500"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              data-testid="input-search-cat-accessories"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-4 px-4 md:py-8 md:px-8">
        <div className="max-w-7xl mx-auto lg:flex lg:gap-6">
          {/* Sidebar */}
          <aside className="lg:w-1/4 mb-4 md:mb-8 lg:mb-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-1">
                  <Filter className="h-5 w-5" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant={selectedCategory === 'All' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => handleCategoryFilter('All')}
                    data-testid="button-category-all"
                  >
                    All Categories
                  </Button>
                  {catAccessoriesCategories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => handleCategoryFilter(category)}
                      data-testid={`button-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content Area */}
          <main className="lg:w-3/4 space-y-4">
            {/* Analytics Bar */}
            <AnalyticsBar products={allProducts} className="" />

            <div className="flex justify-between items-center">
              <h2 className="text-lg md:text-2xl font-bold">
                {selectedCategory === 'All' ? 'All Cat Accessories' : selectedCategory}
              </h2>
              <div className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                {filteredProducts.length} products
              </div>
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
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </section>

      <Footer />
    </div>
  );
}