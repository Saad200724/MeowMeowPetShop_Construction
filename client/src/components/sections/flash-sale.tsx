import { Flame } from 'lucide-react';
import ProductCard from '@/components/ui/product-card';
import { useQuery } from '@tanstack/react-query';

export default function FlashSale() {
  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ['/api/products'],
  });

  // Filter products that are on sale
  const flashSaleProducts = (allProducts as any[]).filter((product: any) => product.isOnSale);

  if (isLoading) {
    return (
      <section className="section-spacing bg-red-50">
        <div className="responsive-container">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 sm:gap-4 bg-red-100 px-6 sm:px-8 py-3 rounded-lg mb-6 w-full max-w-md mx-auto border-2 border-red-200 animate-scale-up">
              <Flame className="text-red-600 md:w-8 md:h-8" size={20} />
              <span className="text-red-600 font-bold text-lg md:text-3xl">FLASH SALE</span>
              <span className="text-sm text-red-600 font-medium hidden sm:inline">Limited Time Offers</span>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-1" style={{ width: 'max-content' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md h-[320px] w-[160px] animate-pulse flex-shrink-0">
                <div className="bg-gray-200 h-28 rounded-t-lg"></div>
                <div className="p-2 space-y-1">
                  <div className="bg-gray-200 h-2 rounded"></div>
                  <div className="bg-gray-200 h-2 w-3/4 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (flashSaleProducts.length === 0) {
    return null; // Don't show section if no flash sale products
  }

  return (
    <section className="section-spacing bg-red-50">
      <div className="responsive-container">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-4 bg-red-100 px-6 sm:px-8 py-3 rounded-lg mb-6 w-full max-w-md mx-auto border-2 border-red-200 animate-scale-up">
            <Flame className="text-red-600 md:w-8 md:h-8" size={20} />
            <span className="text-red-600 font-bold text-lg md:text-3xl">FLASH SALE</span>
            <span className="text-sm text-red-600 font-medium hidden sm:inline">Limited Time Offers</span>
          </div>
          <div className="flex justify-end mb-4">
            <a 
              href="/flash-sale-products" 
              className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm md:text-lg transition-colors"
            >
              More Flash Products
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="flex gap-4 pb-1" style={{ width: 'max-content' }}>
            {flashSaleProducts.slice(0, 15).map((product: any, index: number) => (
              <div 
                key={product.id} 
                className="flex-shrink-0 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}