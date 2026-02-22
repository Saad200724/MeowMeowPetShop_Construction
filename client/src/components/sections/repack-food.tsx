import { Package } from 'lucide-react';
import ProductCard from '@/components/ui/product-card';
import { useQuery } from '@tanstack/react-query';
import { useRef, useEffect } from 'react';

export default function RepackFood() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const userInteractedRef = useRef(false);

  // Fetch repack products from API
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['/api/repack-products'],
    refetchOnWindowFocus: true,
    staleTime: 0,
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

  if (isLoading) {
    return (
      <section className="py-12 bg-[#f8fbfc] px-4 md:px-0">
        <div className="container mx-auto px-4 lg:pl-5">
          <div className="text-center mb-8">
            <h2 className="text-lg md:text-3xl font-bold text-[#26732d] flex items-center justify-center gap-2">
              <Package size={20} className="text-[#26732d] md:w-8 md:h-8" />
              REPACK FOOD
            </h2>
          </div>
          <div className="overflow-x-auto scrollbar-hide pb-1">
            <div className="flex gap-4 pb-1" style={{ width: 'max-content' }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md min-h-[340px] w-[170px] animate-pulse flex-shrink-0">
                  <div className="bg-gray-200 h-28 rounded-t-lg"></div>
                  <div className="p-2 space-y-1">
                    <div className="bg-gray-200 h-2 rounded"></div>
                    <div className="bg-gray-200 h-2 w-3/4 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if ((products as any[]).length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-[#f8fbfc] px-0 md:px-0 overflow-hidden">
      <div className="container mx-auto px-0 md:px-0 lg:pl-5">
        <div className="text-center mb-8 px-2">
          <h2 className="text-lg md:text-3xl font-bold text-[#26732d] mb-4 flex items-center justify-center gap-2">
            <Package size={20} className="text-[#26732d] md:w-8 md:h-8" />
            REPACK FOOD
          </h2>
          <div className="flex justify-end mb-4 px-2">
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

        <div ref={scrollContainerRef} className="overflow-x-auto scrollbar-hide px-2 md:px-0">
          <div className="flex gap-2 pb-1 md:gap-4 px-0">
            {(products as any[]).slice(0, 10).map((product: any, index: number) => (
              <div 
                key={product.id || product._id} 
                className="animate-fade-in flex-shrink-0 w-[calc(50%-4px)] md:w-[220px]"
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