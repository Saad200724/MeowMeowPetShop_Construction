import { Cat } from 'lucide-react';
import ProductCard from '@/components/ui/product-card';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

function BestsellerCarousel({ products }: { products: any[] }) {
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
          <div key={product.id || product._id} className="flex-shrink-0 w-1/2 hover-lift">
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
            className="flex-shrink-0 w-1/2 hover-lift"
            style={{ width: `${100 / products.length}%` }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BestsellersCats() {
  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ['/api/products'],
  });

  // Filter products that are bestsellers and cat-related (cat food, toys, litter, care & health, accessories)
  const catCategories = ['cat-food', 'cat-toys', 'cat-litter', 'cat-care', 'cat-accessories'];
  const products = (allProducts as any[]).filter((product: any) => 
    product.isBestseller && 
    catCategories.includes(product.category)
  );

  return (
    <section className="section-spacing bg-gray-50">
      <div className="responsive-container">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#26732d] mb-8 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in">
          <Cat size={32} className="text-[#26732d]" />
          Bestsellers for Cats
        </h2>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md h-80 animate-pulse">
                <div className="bg-gray-200 h-48 rounded-t-lg"></div>
                <div className="p-4 space-y-2">
                  <div className="bg-gray-200 h-4 rounded"></div>
                  <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No bestselling cat products available.</p>
          </div>
        ) : (
          <BestsellerCarousel products={products.slice(0, 5)} />
        )}
      </div>
    </section>
  );
}