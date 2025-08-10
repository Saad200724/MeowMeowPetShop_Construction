import { Sparkles } from 'lucide-react';
import ProductCard from '@/components/ui/product-card';

export default function NewlyLaunched() {
  const products = [
    {
      id: 13,
      name: 'Orthopedic Pet Bed',
      image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      price: 2800,
      rating: 5,
      reviews: 0,
      badge: 'JUST IN',
      badgeColor: 'blue',
      stockStatus: 'In Stock',
      isNew: true
    },
    {
      id: 14,
      name: 'Smart Auto Feeder',
      image: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      price: 5500,
      rating: 4,
      reviews: 0,
      badge: 'JUST IN',
      badgeColor: 'blue',
      stockStatus: 'In Stock',
      isNew: true
    },
    {
      id: 15,
      name: 'Eco-Friendly Toy Set',
      image: 'https://images.unsplash.com/photo-1625316708582-7c38734be31d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      price: 1200,
      rating: 5,
      reviews: 0,
      badge: 'JUST IN',
      badgeColor: 'blue',
      stockStatus: 'In Stock',
      isNew: true
    },
    {
      id: 16,
      name: 'Premium Travel Carrier',
      image: 'https://images.unsplash.com/photo-1615789591457-74a63395c990?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      price: 3800,
      rating: 4,
      reviews: 0,
      badge: 'JUST IN',
      badgeColor: 'blue',
      stockStatus: 'In Stock',
      isNew: true
    }
  ];

  return (
    <section className="py-12 bg-[#f0f8ff]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-[#26732d] mb-8 flex items-center justify-center gap-3">
          <Sparkles size={32} className="text-[#26732d]" />
          Newly Launched
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="transform hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out relative">
              <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1 z-10">
                <Sparkles size={12} />
                JUST IN
              </div>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
