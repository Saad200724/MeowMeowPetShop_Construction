import { Cat } from 'lucide-react';
import ProductCard from '@/components/ui/product-card';

export default function BestsellersCats() {
  const products = [
    {
      id: 5,
      name: 'Premium Dry Cat Food (5kg)',
      image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      price: 2400,
      rating: 5,
      reviews: 124,
      badge: 'BESTSELLER',
      badgeColor: 'yellow',
      stockStatus: 'In Stock'
    },
    {
      id: 6,
      name: 'Interactive Cat Wand Toy',
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      price: 350,
      rating: 4,
      reviews: 89,
      badge: 'NEW',
      badgeColor: 'blue',
      stockStatus: 'In Stock'
    },
    {
      id: 7,
      name: 'Premium Scratching Post',
      image: 'https://images.unsplash.com/photo-1615789591457-74a63395c990?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      price: 1800,
      rating: 5,
      reviews: 156,
      stockStatus: 'Low Stock'
    },
    {
      id: 8,
      name: 'Self-Cleaning Litter Box',
      image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      price: 4500,
      rating: 4,
      reviews: 67,
      stockStatus: 'In Stock'
    }
  ];

  return (
    <section className="section-spacing bg-gray-50">
      <div className="responsive-container">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#26732d] mb-8 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in">
          <Cat size={32} className="text-[#26732d]" />
          Bestsellers for Cats
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