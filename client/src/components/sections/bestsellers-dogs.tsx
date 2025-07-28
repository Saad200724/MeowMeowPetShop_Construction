import { Dog } from 'lucide-react';
import ProductCard from '@/components/ui/product-card';

export default function BestsellersDogs() {
  const products = [
    {
      id: 9,
      name: 'Premium Dog Food (10kg)',
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      price: 3200,
      rating: 5,
      reviews: 203,
      badge: 'BESTSELLER',
      badgeColor: 'yellow',
      stockStatus: 'In Stock'
    },
    {
      id: 10,
      name: 'Heavy Duty Rope Toy',
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      price: 450,
      rating: 4,
      reviews: 142,
      stockStatus: 'In Stock'
    },
    {
      id: 11,
      name: 'Adjustable Dog Harness',
      image: 'https://images.unsplash.com/photo-1615789591457-74a63395c990?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      price: 950,
      rating: 5,
      reviews: 98,
      badge: 'NEW',
      badgeColor: 'blue',
      stockStatus: 'In Stock'
    },
    {
      id: 12,
      name: 'Interactive Puzzle Feeder',
      image: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      price: 1200,
      rating: 4,
      reviews: 76,
      stockStatus: 'Low Stock'
    }
  ];

  return (
    <section className="section-spacing bg-white">
      <div className="responsive-container">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#26732d] mb-8 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in">
          <Dog size={32} className="text-[#26732d]" />
          Bestsellers for Dogs
        </h2>
        <div className="responsive-grid">
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className="hover-lift animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}