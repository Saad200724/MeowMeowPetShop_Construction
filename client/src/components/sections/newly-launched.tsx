import { Sparkles } from 'lucide-react';
import ProductCard from '@/components/ui/product-card';
import { useQuery } from '@tanstack/react-query';
import { useRef, useEffect } from 'react';

function NewlyLaunchedDisplay({ products }: { products: any[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const userInteractedRef = useRef(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || products.length === 0 || userInteractedRef.current) return;

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
  }, [products.length]);

  if (products.length === 0) {
    return null;
  }

  return (
    <div ref={scrollContainerRef} className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 pb-1 md:grid md:grid-cols-4 lg:grid-cols-5 md:w-full md:gap-4 px-0" style={{ width: 'max-content' }}>
        {products.slice(0, 5).map((product: any) => (
          <div 
            key={product.id || product._id} 
            className="flex-shrink-0 relative w-[calc(50vw-12px)] md:w-full"
            style={{ minWidth: 'auto' }}
          >
            <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1 z-10">
              <Sparkles size={12} />
              JUST IN
            </div>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NewlyLaunched() {
  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ['/api/products'],
  });

  const products = (allProducts as any[]).filter((product: any) => product.isNew);

  if (isLoading) {
    return (
      <section className="py-12 bg-[#f0f8ff] px-4 md:px-0">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-lg font-bold text-[#26732d] mb-4 flex items-center justify-center gap-2">
              <Sparkles size={20} className="text-[#26732d]" />
              NEWLY LAUNCHED
            </h2>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 pb-1" style={{ width: 'max-content' }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-shrink-0 w-[170px] min-h-[340px] bg-white rounded-lg shadow-md animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-t-lg"></div>
                  <div className="p-4 space-y-2">
                    <div className="bg-gray-200 h-4 rounded"></div>
                    <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-[#f0f8ff] px-0 md:px-0 overflow-hidden">
      <div className="container mx-auto px-0 md:px-0 lg:pl-5">
        <div className="text-center mb-8 px-4">
          <h2 className="text-lg md:text-3xl font-bold text-[#26732d] mb-4 flex items-center justify-center gap-2">
            <Sparkles size={20} className="text-[#26732d] md:w-8 md:h-8" />
            NEWLY LAUNCHED
          </h2>
          <div className="flex justify-end mb-4">
            <a 
              href="/newly-launched" 
              className="inline-flex items-center gap-2 text-[#26732d] hover:text-[#1d5a22] font-medium text-sm md:text-lg transition-colors"
            >
              More New Products
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </a>
          </div>
        </div>
        <NewlyLaunchedDisplay products={products.slice(0, 15)} />
      </div>
    </section>
  );
}
