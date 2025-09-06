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
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 bg-red-100 px-4 sm:px-6 py-3 rounded-lg mb-6 w-fit mx-auto border-2 border-red-200 animate-scale-up">
              <Flame className="text-red-600" size={24} />
              <span className="text-red-600 font-bold text-lg">Flash Sale</span>
              <span className="text-sm text-red-600 font-medium">Limited Time Offers</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md h-80 animate-pulse">
                <div className="bg-gray-200 h-48 rounded-t-lg"></div>
                <div className="p-4 space-y-2">
                  <div className="bg-gray-200 h-4 rounded"></div>
                  <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 bg-red-100 px-6 sm:px-12 py-3 rounded-lg mb-6 w-full max-w-md mx-auto border-2 border-red-200 animate-scale-up">
            <Flame className="text-red-600" size={24} />
            <span className="text-red-600 font-bold text-lg">Flash Sale</span>
            <span className="text-sm text-red-600 font-medium">Limited Time Offers</span>
          </div>
          <div className="flex justify-end mb-4">
            <a 
              href="/flash-sale-products" 
              className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-lg transition-colors"
              rel="prefetch"
            >
              More Flash Products
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-4 md:gap-6">
          {flashSaleProducts.map((product: any, index: number) => (
            <div 
              key={product.id} 
              className="hover-lift animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}