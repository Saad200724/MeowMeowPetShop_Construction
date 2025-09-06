import { Sparkles } from 'lucide-react';
import ProductCard from '@/components/ui/product-card';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

function NewlyLaunchedCarousel({ products }: { products: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Don't render anything if no products
  if (products.length === 0) {
    return null;
  }

  useEffect(() => {
    if (products.length <= 2) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        // Reset to 0 when we reach the last valid position (showing 2 products)
        const maxIndex = products.length - 2;
        return nextIndex > maxIndex ? 0 : nextIndex;
      });
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [products.length]);

  if (products.length <= 2) {
    return (
      <div className="flex gap-4">
        {products.map((product: any) => (
          <div key={product.id || product._id} className="flex-shrink-0 w-1/2 hover-lift relative">
            <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1 z-10">
              <Sparkles size={12} />
              JUST IN
            </div>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div 
        className="flex gap-4 transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 50}%)`,
          width: `${products.length * 50}%`
        }}
      >
        {products.map((product: any) => (
          <div 
            key={product.id || product._id}
            className="flex-shrink-0 w-1/2 hover-lift relative"
            style={{ width: `${100 / products.length}%` }}
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
          <h2 className="text-3xl font-bold text-center text-[#26732d] mb-8 flex items-center justify-center gap-3">
            <Sparkles size={32} className="text-[#26732d]" />
            Newly Launched
          </h2>
          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
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

  if (products.length === 0) {
    return null; // Don't show section if no new products
  }

  return (
    <section className="py-12 bg-[#f0f8ff]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-[#26732d] mb-8 flex items-center justify-center gap-3">
          <Sparkles size={32} className="text-[#26732d]" />
          Newly Launched
        </h2>
        <NewlyLaunchedCarousel products={products.slice(0, 5)} />
      </div>
    </section>
  );
}