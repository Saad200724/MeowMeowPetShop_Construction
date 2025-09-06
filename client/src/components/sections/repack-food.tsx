import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Heart, Plus, Minus, Package } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { useToast } from '@/hooks/use-toast';

export default function RepackFood() {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const { addItem } = useCart();
  const { toast } = useToast();

  // Fetch repack products from API
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['/api/repack-products'],
  });

  // Initialize quantities when products are loaded
  useEffect(() => {
    if ((products as any[]).length > 0) {
      const initialQuantities: { [key: string]: number } = {};
      (products as any[]).forEach((product: any) => {
        initialQuantities[product.id || product._id] = 1;
      });
      setQuantities(initialQuantities);
    }
  }, [products]);

  const updateQuantity = (id: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
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

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#26732d] mb-8 flex items-center justify-center gap-3">
            <Package size={32} className="text-[#26732d]" />
            Repack Food - Bulk Save!
          </h2>
          <div className="overflow-x-auto">
            <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
              {[1, 2, 3].map(i => (
                <div key={i} className="flex-shrink-0 w-64 bg-white rounded-lg shadow-md h-[400px] animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-t-lg"></div>
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
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#26732d] mb-4 flex items-center justify-center gap-3">
            <Package size={32} className="text-[#26732d]" />
            Repack Food - Bulk Save!
          </h2>
          <a
            href="/bulk-products"
            className="inline-flex items-center gap-2 text-[#26732d] hover:text-[#1e5d26] font-medium text-lg transition-colors"
            rel="prefetch"
          >
            More Repacks
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </a>
        </div>
        <div className="overflow-x-auto">
          <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
            {(products as any[]).slice(0, 3).map((product: any) => {
            const productId = product.id || product._id;
            const savings = calculateSavings(product.price, product.originalPrice);
            const badge = getBadgeFromTags(product.tags);

            return (
              <div key={productId} className="flex-shrink-0 w-64 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 relative h-[280px] flex flex-col">
                <div className="absolute top-2 left-2 bg-yellow-400 text-[#26732d] px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 z-10">
                  <Package size={12} />
                  {badge}
                </div>
                <div className="absolute top-2 right-2 z-10">
                  <button className="bg-white bg-opacity-80 p-1.5 rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm">
                    <Heart size={14} />
                  </button>
                </div>

                <div className="flex flex-col h-full">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold mb-1 text-sm text-[#26732d] leading-tight line-clamp-2">{product.name}</h4>
                      <div className="text-xs text-gray-600 mb-2">
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
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-base font-bold text-[#26732d]">৳{product.price?.toLocaleString()}</span>
                          {product.originalPrice && (
                            <span className="text-xs text-gray-600 line-through">৳{product.originalPrice?.toLocaleString()}</span>
                          )}
                        </div>
                        {savings > 0 && (
                          <span className="bg-yellow-400 text-[#26732d] font-bold text-xs px-2 py-1 rounded-full whitespace-nowrap shadow-sm">
                            {savings}%
                          </span>
                        )}
                      </div>
                      <Button
                        className="bg-[#26732d] text-white px-3 py-1 rounded-md hover:bg-[#1e5d26] transition-colors text-xs font-medium w-full shadow-sm h-7"
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
                        {(product.stockQuantity || product.stock || 0) === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
}