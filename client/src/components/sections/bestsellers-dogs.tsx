import { Dog } from 'lucide-react';
import ProductCard from '@/components/ui/product-card';
import { useQuery } from '@tanstack/react-query';

function BestsellerDisplay({ products }: { products: any[] }) {
  // Don't render anything if no products
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 pb-1" style={{ width: 'max-content' }}>
        {products.slice(0, 3).map((product: any) => (
          <div 
            key={product.id || product._id} 
            className="flex-shrink-0"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

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
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#26732d] mb-4 flex items-center justify-center gap-2">
            <Dog size={24} className="text-[#26732d]" />
            BESTSELLERS FOR DOGS
          </h2>
          <div className="flex justify-end mb-4">
            <a 
              href="/dog-best-seller" 
              className="inline-flex items-center gap-2 text-[#26732d] hover:text-[#1d5a22] font-medium text-lg transition-colors"
              rel="prefetch"
            >
              More Dog Products
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </a>
          </div>
        </div>
        {isLoading ? (
          <div className="overflow-x-auto">
            <div className="flex gap-3 pb-1" style={{ width: 'max-content' }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-shrink-0 w-[160px] h-[280px] bg-white rounded-lg shadow-md animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-t-lg"></div>
                  <div className="p-4 space-y-2">
                    <div className="bg-gray-200 h-4 rounded"></div>
                    <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No bestselling dog products available.</p>
          </div>
        ) : (
          <BestsellerDisplay products={products.slice(0, 3)} />
        )}
      </div>
    </section>
  );
}