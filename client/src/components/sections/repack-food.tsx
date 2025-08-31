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
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg shadow-md h-[400px] animate-pulse">
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
          <a href="/bulk-products" className="inline-flex items-center gap-2 text-[#26732d] hover:text-[#1e5d26] font-medium text-lg transition-colors">
            More Repacks
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </a>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {(products as any[]).map((product: any) => {
            const productId = product.id || product._id;
            const savings = calculateSavings(product.price, product.originalPrice);
            const badge = getBadgeFromTags(product.tags);
            
            return (
              <div key={productId} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 relative min-h-[400px] flex flex-col">
                <div className="absolute top-2 left-2 bg-yellow-400 text-[#26732d] px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 z-10">
                  <Package size={14} />
                  {badge}
                </div>
                <div className="absolute top-2 right-2 z-10">
                  <button className="bg-white bg-opacity-80 p-1.5 rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm">
                    <Heart size={18} />
                  </button>
                </div>

                <div className="flex flex-col h-full">
                  <div className="relative">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-48 object-cover rounded-t-lg" 
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h4 className="font-bold mb-2 text-base text-[#26732d] leading-tight">{product.name}</h4>
                    <p className="text-sm text-gray-700 mb-2 flex-1 leading-relaxed">{product.description}</p>
                    <div className="text-sm text-gray-600 mb-3">
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
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex flex-col">
                          <span className="text-xl font-bold text-[#26732d]">৳{product.price?.toLocaleString()}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-600 line-through">৳{product.originalPrice?.toLocaleString()}</span>
                          )}
                        </div>
                        {savings > 0 && (
                          <span className="bg-yellow-400 text-[#26732d] font-bold text-sm px-3 py-1 rounded-full whitespace-nowrap shadow-sm">
                            Save {savings}%
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center bg-gray-50 rounded-lg px-2 py-1">
                          <input
                            type="number"
                            min="1"
                            max={product.stockQuantity || product.stock || 0}
                            value={quantities[productId] || 1}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 1;
                              const maxStock = product.stockQuantity || product.stock || 0;
                              const validValue = Math.max(1, Math.min(value, maxStock));
                              setQuantities(prev => ({ ...prev, [productId]: validValue }));
                            }}
                            className="w-16 text-center border-0 bg-transparent font-medium text-gray-900 focus:outline-none"
                            disabled={(product.stockQuantity || product.stock || 0) === 0}
                          />
                        </div>
                        <Button 
                          className="bg-[#26732d] text-white px-4 py-2 rounded-lg hover:bg-[#1e5d26] transition-colors text-sm font-medium flex-1 max-w-[130px] shadow-sm"
                          onClick={() => {
                            const quantity = quantities[productId] || 1;
                            const stockAvailable = product.stockQuantity || product.stock || 0;
                            
                            if (stockAvailable === 0) {
                              toast({
                                title: 'Out of Stock',
                                description: 'This item is currently out of stock.',
                                variant: 'destructive'
                              });
                              return;
                            }
                            
                            if (quantity > stockAvailable) {
                              toast({
                                title: 'Insufficient Stock',
                                description: `Only ${stockAvailable} items available.`,
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
                            
                            // Add the remaining quantity if more than 1
                            if (quantity > 1) {
                              for (let i = 1; i < quantity; i++) {
                                addItem({
                                  id: productId,
                                  name: product.name,
                                  price: product.price,
                                  image: product.image,
                                  maxStock: stockAvailable
                                });
                              }
                            }
                            
                            toast({
                              title: 'Added to Cart',
                              description: `${quantity} × ${product.name} added to your cart.`
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
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}