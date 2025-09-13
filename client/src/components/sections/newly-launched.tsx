import { Sparkles } from 'lucide-react';
import ProductCard from '@/components/ui/product-card';
import { useQuery } from '@tanstack/react-query';

function NewlyLaunchedDisplay({ products }: { products: any[] }) {
  // Don't render anything if no products
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-4 pb-1" style={{ width: 'max-content' }}>
        {products.slice(0, 4).map((product: any) => (
          <div 
            key={product.id || product._id} 
            className="flex-shrink-0 relative"
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

  // Filter products that are newly launched
  const products = (allProducts as any[]).filter((product: any) => product.isNew);

  if (isLoading) {
    return (
      <section className="py-12 bg-[#f0f8ff]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#26732d] mb-4 flex items-center justify-center gap-3">
              <Sparkles size={32} className="text-[#26732d]" />
              Newly Launched
            </h2>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-3 pb-1" style={{ width: 'max-content' }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-shrink-0 w-[160px] h-[320px] bg-white rounded-lg shadow-md animate-pulse">
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
    return null; // Don't show section if no new products
  }

  return (
    <section className="py-12 bg-[#f0f8ff]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#26732d] mb-4 flex items-center justify-center gap-2">
            <Sparkles size={24} className="text-[#26732d]" />
            NEWLY LAUNCHED
          </h2>
          <div className="flex justify-end mb-4">
            <a 
              href="/newly-launched" 
              className="inline-flex items-center gap-2 text-[#26732d] hover:text-[#1d5a22] font-medium text-lg transition-colors"
            >
              More New Products
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </a>
          </div>
        </div>
        <NewlyLaunchedDisplay products={products.slice(0, 4)} />
      </div>
    </section>
  );
}