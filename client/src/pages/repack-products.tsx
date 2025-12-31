import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Package, ShoppingCart, Search } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import NavigationSidebar from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/cart-context';
import { useToast } from '@/hooks/use-toast';
import { useSidebar } from '@/contexts/sidebar-context';

export default function RepackProducts() {
  const { isVisible: sidebarVisible } = useSidebar();
  const [searchQuery, setSearchQuery] = useState('');
  const { addItem } = useCart();
  const { toast } = useToast();

  // Fast API query with optimized settings
  const { data: repackProducts = [], isLoading, error } = useQuery({
    queryKey: ['/api/repack-products'],
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Filter products by search query
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(repackProducts)) return [];
    return repackProducts.filter((product: any) => 
      product.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [repackProducts, searchQuery]);

  const calculateSavings = (price: number, originalPrice: number) => {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  const getBadgeFromTags = (tags: string[]) => {
    if (tags?.includes('combo-deal')) return 'COMBO DEAL';
    if (tags?.includes('bulk-save')) return 'BULK SAVE';
    return 'REPACK';
  };

  const handleAddToCart = (product: any) => {
    const productId = product.id || product._id;
    const stockAvailable = product.stockQuantity || product.stock || 0;

    if (stockAvailable === 0) {
      toast({
        title: 'Out of Stock',
        description: 'This item is currently out of stock.',
        variant: 'destructive'
      });
      return;
    }

    addItem({
      id: productId,
      name: product.name,
      price: product.price,
      image: product.image,
      maxStock: stockAvailable
    });

    toast({
      title: 'Added to Cart',
      description: `${product.name} added to your cart.`
    });
  };

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
        <section className="pt-24 pb-8 px-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Package className="h-10 w-10" />
              <h1 className="text-3xl md:text-4xl font-bold">Repack Products</h1>
            </div>
            <p className="text-lg opacity-90 mb-6">Premium pet food repacked in smaller quantities - perfect for trying new products</p>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-6 px-4 bg-white border-b">
          <div className="max-w-7xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search repack products..."
                className="pl-10 text-black placeholder:text-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }, (_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-t-lg"></div>
                    <CardContent className="p-4 space-y-3">
                      <div className="bg-gray-200 h-4 rounded"></div>
                      <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
                      <div className="bg-gray-200 h-6 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  {searchQuery ? 'No products found' : 'No repack products available'}
                </h3>
                <p className="text-gray-500">
                  {searchQuery ? 'Try adjusting your search terms' : 'Check back later for repack deals!'}
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-lg font-medium text-gray-700">
                    {filteredProducts.length} repack {filteredProducts.length === 1 ? 'product' : 'products'} found
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product: any) => {
                    const savings = calculateSavings(product.price, product.originalPrice);
                    const badge = getBadgeFromTags(product.tags || []);
                    const stockAvailable = product.stockQuantity || product.stock || 0;
                    const productId = product.id || product._id;
                    
                    return (
                      <Link key={productId} href={`/product/${productId}`} asChild>
                        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                          {/* Product Image */}
                          <div className="relative overflow-hidden bg-gray-50 rounded-t-lg p-4">
                            {savings > 0 ? (
                              <Badge className="absolute top-3 left-3 z-10 bg-red-500 text-white">
                                -{savings}%
                              </Badge>
                            ) : (
                              <Badge className="absolute top-3 left-3 z-10 bg-yellow-400 text-[#26732d] flex items-center gap-1">
                                <Package size={12} />
                                {badge}
                              </Badge>
                            )}
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-full h-48 object-contain transition-transform duration-500 group-hover:scale-110" 
                              loading="lazy"
                            />
                          </div>
                          
                          {/* Product Content */}
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
                              {product.name}
                            </h3>
                            
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {product.description}
                            </p>
                            
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-lg font-bold text-green-600">
                                ৳{product.price?.toLocaleString()}
                              </span>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-sm text-red-500 line-through">
                                  ৳{product.originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className={`text-sm font-medium ${
                                stockAvailable > 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {stockAvailable > 0 ? 'In Stock' : 'Out of Stock'}
                              </div>
                              
                              <Button 
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleAddToCart(product);
                                }}
                                disabled={stockAvailable === 0}
                                className="bg-[#26732d] hover:bg-[#1d5a22] text-white"
                              >
                                <ShoppingCart className="h-4 w-4 mr-1" />
                                Add to Cart
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
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