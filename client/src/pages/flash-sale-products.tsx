
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Flame, Search } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import NavigationSidebar from '@/components/layout/sidebar';
import ProductCard from '@/components/product/product-card';
import { useProducts } from '@/hooks/use-products';

export default function FlashSaleProducts() {
  const [searchQuery, setSearchQuery] = useState('');

  const { loading, error, products } = useProducts();

  // Filter for flash sale products
  const flashSaleProducts = products.filter(product => product.isOnSale);

  // Filter products based on search query
  const filteredProducts = flashSaleProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center pt-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading flash sale products...</p>
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Flash Sale Products</h2>
            <p className="text-gray-600">{filteredProducts.length} products found</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* No Products Message */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Flame className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No flash sale products found.</p>
              <Button
                variant="outline"
                className="mt-4 text-gray-900 border-gray-400 bg-white hover:bg-gray-100"
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
