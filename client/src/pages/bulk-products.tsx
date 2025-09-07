import { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Package, Star, ShoppingCart, Filter, Home, ArrowLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/cart-context';
import { useToast } from '@/hooks/use-toast';

export default function BulkProducts() {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const { addItem } = useCart();
  const { toast } = useToast();

  // Debounce search term to improve performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch repack products from API
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['/api/repack-products'],
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
    cacheTime: 15 * 60 * 1000, // Keep in cache for 15 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
  });

  // Initialize quantities when products are loaded
  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      const initialQuantities: { [key: string]: number } = {};
      products.forEach((product: any) => {
        initialQuantities[product.id || product._id] = 1;
      });
      setQuantities(initialQuantities);
    }
  }, [products]);

  const updateQuantity = useCallback((id: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
    }));
  }, []);

  const getBadgeFromTags = useCallback((tags: string[]) => {
    if (tags?.includes('combo-deal')) return 'COMBO DEAL';
    if (tags?.includes('bulk-save')) return 'BULK SAVE';
    return 'REPACK';
  }, []);

  const calculateSavings = useCallback((price: number, originalPrice: number) => {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    
    return products
      .filter((product: any) => 
        product?.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        product?.description?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
      .sort((a: any, b: any) => {
        switch (sortBy) {
          case 'price-low':
            return (a?.price || 0) - (b?.price || 0);
          case 'price-high':
            return (b?.price || 0) - (a?.price || 0);
          case 'savings':
            const savingsA = calculateSavings(a?.price || 0, a?.originalPrice || 0);
            const savingsB = calculateSavings(b?.price || 0, b?.originalPrice || 0);
            return savingsB - savingsA;
          case 'name':
          default:
            return (a?.name || '').localeCompare(b?.name || '');
        }
      });
  }, [products, debouncedSearchTerm, sortBy, calculateSavings]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <div className="bg-gray-200 h-12 w-96 mx-auto rounded-lg animate-pulse mb-4"></div>
              <div className="bg-gray-200 h-6 w-64 mx-auto rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Loading Products */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-white rounded-lg shadow-md h-[450px] animate-pulse">
                <div className="bg-gray-200 h-48 rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-200 h-3 rounded w-full"></div>
                  <div className="bg-gray-200 h-3 rounded w-5/6"></div>
                  <div className="bg-gray-200 h-6 rounded w-1/2"></div>
                  <div className="bg-gray-200 h-10 rounded w-full mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="relative">
            {/* Go Home Button */}
            <div className="absolute left-0 top-0">
              <a 
                href="/" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#26732d] text-white rounded-lg hover:bg-[#1e5d26] transition-colors"
              >
                <Home size={18} />
                Go Home
              </a>
            </div>
            
            <div className="text-center">
              <h1 className="text-4xl font-bold text-[#26732d] mb-4 flex items-center justify-center gap-3">
                <Package size={40} className="text-[#26732d]" />
                Bulk Products - Save More!
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover our complete collection of repack and bulk food products. Perfect for multiple pets or long-term savings.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Input
                  placeholder="Search bulk products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-black placeholder:text-gray-400"
                />
                <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Sort by:</span>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 text-black">
                  <SelectValue className="text-black" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="savings">Best Savings</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            All Bulk Products ({filteredAndSortedProducts.length})
          </h2>
          <Badge variant="outline" className="text-[#26732d] border-[#26732d]">
            Up to 40% savings on bulk orders
          </Badge>
        </div>

        {!isLoading && filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1">
            {filteredAndSortedProducts.map((product: any) => {
              const productId = product.id || product._id;
              const savings = calculateSavings(product.price, product.originalPrice);
              const badge = getBadgeFromTags(product.tags);
              
              return (
                <div key={productId} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative min-h-[450px] flex flex-col">
                  <div className="absolute top-3 left-3 bg-yellow-400 text-[#26732d] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 z-10">
                    <Package size={14} />
                    {badge}
                  </div>
                  <div className="absolute top-3 right-3 z-10">
                    <button className="bg-white bg-opacity-90 p-2 rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-md">
                      <Heart size={18} />
                    </button>
                  </div>

                  {savings > 0 && (
                    <div className="absolute top-12 right-3 z-10">
                      <Badge className="bg-red-500 text-white font-bold text-xs">
                        -{savings}%
                      </Badge>
                    </div>
                  )}

                  <div className="flex flex-col h-full">
                    <div className="relative">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-56 object-cover rounded-t-lg"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-bold mb-2 text-lg text-[#26732d] leading-tight">{product.name}</h3>
                      <p className="text-sm text-gray-700 mb-2 flex-1 leading-relaxed">{product.description}</p>
                      <div className="text-sm text-gray-600 mb-4">
                        <span className="font-medium">Stock: </span>
                        <span className={`font-semibold ${
                          (product.stockQuantity || product.stock || 0) === 0 
                            ? 'text-red-600' 
                            : (product.stockQuantity || product.stock || 0) < 10 
                            ? 'text-orange-600' 
                            : 'text-green-600'
                        }`}>
                          {(product.stockQuantity || product.stock || 0)} available
                        </span>
                      </div>
                      
                      {/* Rating */}
                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              size={14} 
                              className={star <= (product.rating || 4.5) ? "text-yellow-400 fill-current" : "text-gray-300"}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-2">({product.rating || 4.5})</span>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex flex-col">
                            <span className="text-xl font-bold text-[#26732d]">৳{product.price?.toLocaleString()}</span>
                            {product.originalPrice && (
                              <span className="text-sm text-gray-600 line-through">৳{product.originalPrice?.toLocaleString()}</span>
                            )}
                          </div>
                          {savings > 0 && (
                            <span className="bg-yellow-400 text-[#26732d] font-bold text-sm px-3 py-1 rounded-full shadow-sm">
                              Save {savings}%
                            </span>
                          )}
                        </div>
                        
                        <div className="w-full">
                          <Button 
                            className="bg-[#26732d] text-white px-4 py-2 rounded-lg hover:bg-[#1e5d26] transition-colors text-sm w-full flex items-center justify-center gap-2 font-medium shadow-sm"
                            onClick={() => {
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
                            }}
                            disabled={(product.stockQuantity || product.stock || 0) === 0}
                          >
                            <ShoppingCart size={16} />
                            {(product.stockQuantity || product.stock || 0) === 0 ? 'Out of Stock' : 'Add to Cart'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-[#26732d] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Package className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Save More with Bulk Orders</h2>
          <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
            Purchase in bulk and enjoy significant savings on premium pet food. Perfect for pet shelters, multiple pet owners, or long-term savings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact">
              <Button size="lg" className="bg-yellow-400 text-[#26732d] hover:bg-yellow-300 font-bold w-full sm:w-auto">
                Contact for Custom Orders
              </Button>
            </a>
            <a href="/bulk-discounts">
              <Button size="lg" className="bg-[#26732d] text-white hover:bg-[#1e5d26] border-[#26732d] w-full sm:w-auto">
                Learn About Bulk Discounts
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}