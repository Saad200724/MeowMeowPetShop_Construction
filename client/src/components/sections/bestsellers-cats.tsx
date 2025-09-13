import { Cat } from 'lucide-react';
import ProductCard from '@/components/ui/product-card';
import { useQuery } from '@tanstack/react-query';

function BestsellerDisplay({ products }: { products: any[] }) {
  // Don't render anything if no products
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1 pb-1" style={{ width: 'max-content' }}>
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
        <div className="text-center mb-8">
          <h2 className="text-lg md:text-xl font-bold text-[#26732d] mb-4 flex items-center justify-center gap-2">
            <Cat size={20} className="text-[#26732d] md:w-6 md:h-6" />
            BESTSELLERS FOR CATS
          </h2>
          <div className="flex justify-end mb-4">
            <a 
              href="/cat-best-seller" 
              className="inline-flex items-center gap-2 text-[#26732d] hover:text-[#1d5a22] font-medium text-sm md:text-lg transition-colors"
            >
              More Cat Products
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </a>
          </div>
        </div>
        {isLoading ? (
          <div className="overflow-x-auto">
            <div className="flex gap-1 pb-1" style={{ width: 'max-content' }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-shrink-0 w-64 bg-white rounded-lg shadow-md h-80 animate-pulse">
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
            <p className="text-gray-600">No bestselling cat products available.</p>
          </div>
        ) : (
          <BestsellerDisplay products={products.slice(0, 3)} />
        )}
      </div>
    </section>
  );
}