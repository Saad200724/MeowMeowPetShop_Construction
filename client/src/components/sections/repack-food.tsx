import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Check, Package } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Link } from 'wouter';

export default function RepackFood() {
  const [likedItems, setLikedItems] = useState<{ [key: string]: boolean }>({});
  const { addItem, getItemQuantity } = useCart();
  const { toast } = useToast();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const userInteractedRef = useRef(false);

  // Fetch repack products from API
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['/api/repack-products'],
  });

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || (products as any[]).length === 0 || userInteractedRef.current) return;

    const startAutoScroll = () => {
      autoScrollIntervalRef.current = setInterval(() => {
        if (userInteractedRef.current) {
          if (autoScrollIntervalRef.current) {
            clearInterval(autoScrollIntervalRef.current);
          }
          return;
        }

        const maxScroll = container.scrollWidth - container.clientWidth;
        const currentScroll = container.scrollLeft;

        if (currentScroll >= maxScroll) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: 200, behavior: 'smooth' });
        }
      }, 3000);
    };

    const handleUserInteraction = () => {
      userInteractedRef.current = true;
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
    };

    container.addEventListener('touchstart', handleUserInteraction);
    container.addEventListener('mousedown', handleUserInteraction);
    container.addEventListener('wheel', handleUserInteraction);

    startAutoScroll();

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
      container.removeEventListener('touchstart', handleUserInteraction);
      container.removeEventListener('mousedown', handleUserInteraction);
      container.removeEventListener('wheel', handleUserInteraction);
    };
  }, [(products as any[]).length]);

  const toggleLike = (id: string) => {
    setLikedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getBadgeFromTags = (tags: string[]) => {
    if (tags?.includes('combo-deal')) return 'COMBO DEAL';
    if (tags?.includes('bulk-save')) return 'BULK SAVE';
    return 'REPACK';
  };

  const calculateSavings = (price: number, originalPrice: number) => {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
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

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-lg md:text-3xl font-bold text-[#26732d] flex items-center justify-center gap-2">
              <Package size={20} className="text-[#26732d] md:w-8 md:h-8" />
              REPACK FOOD
            </h2>
          </div>
          <div className="overflow-x-auto scrollbar-hide pb-2">
            <div className="flex gap-4 min-w-max px-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex-shrink-0 w-52 bg-white rounded-2xl shadow-md h-[320px] animate-pulse border border-gray-100">
                  <div className="bg-gray-200 h-32 rounded-t-2xl"></div>
                  <div className="p-4 space-y-3">
                    <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                    <div className="bg-gray-200 h-3 rounded w-full"></div>
                    <div className="bg-gray-200 h-6 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12" style={{ backgroundColor: '#f8fbfc' }}>
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="text-center mb-4">
            <h2 className="text-lg md:text-3xl font-bold text-[#26732d] flex items-center justify-center gap-2">
              <Package size={20} className="text-[#26732d] md:w-8 md:h-8" />
              REPACK FOOD
            </h2>
          </div>
          <div className="flex justify-end">
            <a
              href="/repack-products"
              className="inline-flex items-center gap-2 text-[#26732d] hover:text-[#1e5d26] font-medium text-sm md:text-lg transition-colors"
            >
              More Repacks
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </a>
          </div>
        </div>
        <div ref={scrollContainerRef} className="overflow-x-auto scrollbar-hide pb-2">
          <div className="flex gap-4 min-w-max px-4">
            {(products as any[]).slice(0, 8).map((product: any) => {
              const productId = product.id || product._id;
              const savings = calculateSavings(product.price, product.originalPrice);
              const badge = getBadgeFromTags(product.tags);
              const stockAvailable = product.stockQuantity || product.stock || 0;
              const itemQuantity = getItemQuantity(productId);
              const isInCart = itemQuantity > 0;
              const isLiked = likedItems[productId];

              return (
                <Link href={`/product/${productId}`} key={productId}>
                  <Card 
                    className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden bg-white border border-gray-100 rounded-2xl flex-shrink-0 w-52 cursor-pointer"
                  >
                    {/* Discount Badge */}
                    {savings > 0 && (
                      <Badge className="absolute top-3 left-3 z-10 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{savings}%
                      </Badge>
                    )}

                    {/* Repack Badge */}
                    {!savings && (
                      <Badge className="absolute top-3 left-3 z-10 bg-yellow-400 text-[#26732d] text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <Package size={12} />
                        {badge}
                      </Badge>
                    )}

                    {/* Like Button */}
                    <Button 
                      variant="ghost"
                      size="sm"
                      className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-sm hover:bg-white p-2 rounded-full shadow-sm"
                      onClick={(e) => {
                        e.preventDefault(); // Prevent link navigation
                        e.stopPropagation(); // Stop event from bubbling up
                        toggleLike(productId)
                      }}
                    >
                      <Heart 
                        size={16} 
                        className={cn(
                          'transition-colors',
                          isLiked ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-500'
                        )} 
                      />
                    </Button>

                    {/* Product Image */}
                    <div className="relative overflow-hidden bg-gray-50 rounded-t-2xl p-4">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-32 object-contain transition-transform duration-500 group-hover:scale-110" 
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    <CardContent className="p-3 space-y-2">
                      {/* Category Tag */}
                      <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                        Repack Food
                      </div>

                      {/* Product Name */}
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-[#26732d] transition-colors min-h-[2.5rem]">
                        {product.name}
                      </h3>

                      {/* Price Section */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-[#26732d]">
                            ৳{product.price?.toLocaleString()}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              ৳{product.originalPrice?.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Stock Status */}
                        <div className="text-xs text-gray-500">
                          {stockAvailable > 0 ? (
                            <span className={cn(
                              'font-medium',
                              stockAvailable < 10 ? 'text-orange-600' : 'text-green-600'
                            )}>
                              {stockAvailable < 10 ? `Only ${stockAvailable} left` : `${stockAvailable} available`}
                            </span>
                          ) : (
                            <span className="text-red-600 font-medium">Out of Stock</span>
                          )}
                        </div>
                      </div>

                      {/* Add to Cart Button */}
                      <Button 
                        variant={isInCart ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "w-full rounded-full py-2 transition-all duration-200 border-2",
                          isInCart 
                            ? "bg-[#26732d] border-[#26732d] text-white hover:bg-[#1e5d26]" 
                            : "border-gray-200 text-gray-700 hover:border-[#26732d] hover:text-[#26732d] hover:bg-[#26732d]/5"
                        )}
                        disabled={stockAvailable === 0}
                        onClick={(e) => {
                          e.preventDefault(); // Prevent link navigation
                          e.stopPropagation(); // Stop event from bubbling up
                          handleAddToCart(product)
                        }}
                      >
                        {stockAvailable === 0 ? (
                          'Out of Stock'
                        ) : isInCart ? (
                          <>
                            <Check size={16} className="mr-1" />
                            Added
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={16} className="mr-1" />
                            Add to Cart
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}