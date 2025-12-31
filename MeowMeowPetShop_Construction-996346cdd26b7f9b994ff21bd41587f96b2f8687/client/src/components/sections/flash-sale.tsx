import { Flame } from 'lucide-react';
import ProductCard from '@/components/ui/product-card';
import { useQuery } from '@tanstack/react-query';
import { useRef, useEffect } from 'react';

export default function FlashSale() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const userInteractedRef = useRef(false);

  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ['/api/products'],
  });

  const flashSaleProducts = (allProducts as any[]).filter((product: any) => product.isOnSale);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || flashSaleProducts.length === 0 || userInteractedRef.current) return;

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
  }, [flashSaleProducts.length]);

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
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-1" style={{ width: 'max-content' }}>
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
    return null;
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

        <div ref={scrollContainerRef} className="overflow-x-auto scrollbar-hide">
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
