import { Dog } from 'lucide-react';
import ProductCard from '@/components/ui/product-card';
import { useQuery } from '@tanstack/react-query';

export default function BestsellersDogs() {
  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ['/api/products'],
  });

  // Filter products that are bestsellers and dog-related (dog food, dog health & accessories)
  const dogCategories = ['dog-food', 'dog-accessories'];
  const products = (allProducts as any[]).filter((product: any) => 
    product.isBestseller && 
    dogCategories.includes(product.category)
  );

  return (
    <section className="section-spacing bg-white">
      <div className="responsive-container">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#26732d] mb-8 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in">
          <Dog size={32} className="text-[#26732d]" />
          Bestsellers for Dogs
        </h2>
        {isLoading ? (
          <div className="responsive-grid">
            {[1, 2, 3, 4].map((i) => (
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
            <p className="text-gray-600">No bestselling dog products available.</p>
          </div>
        ) : (
          <div className="responsive-grid">
            {products.map((product: any, index: number) => (
              <div 
                key={product.id || product._id} 
                className="hover-lift animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}