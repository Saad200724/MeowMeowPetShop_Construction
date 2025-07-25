import { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';
import ProductCard from '@/components/ui/product-card';
import CountdownTimer from '@/components/ui/countdown-timer';

export default function FlashSale() {
  const flashSaleProducts = [
    {
      id: 1,
      name: 'Premium Wet Cat Food (12 pack)',
      image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      price: 1200,
      originalPrice: 2400,
      discount: 50,
      badge: '50% OFF',
      badgeColor: 'red'
    },
    {
      id: 2,
      name: 'Interactive Dog Chew Toys',
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      price: 800,
      originalPrice: 1333,
      discount: 40,
      badge: '40% OFF',
      badgeColor: 'red'
    },
    {
      id: 3,
      name: 'Professional Grooming Kit',
      image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      price: 1950,
      originalPrice: 3000,
      discount: 35,
      badge: '35% OFF',
      badgeColor: 'red'
    },
    {
      id: 4,
      name: 'Premium Training Treats',
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      price: 600,
      originalPrice: 1091,
      discount: 45,
      badge: '45% OFF',
      badgeColor: 'red'
    }
  ];

  return (
    <section className="py-12 bg-red-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center gap-4 bg-red-100 px-6 py-3 rounded-lg mb-6 w-fit mx-auto border-2 border-red-200">
            <Flame className="text-red-600" size={24} />
            <span className="text-red-600 font-bold text-lg">Flash Sale</span>
            <div className="text-sm text-gray-800 font-medium">
              <CountdownTimer initialHours={23} initialMinutes={45} initialSeconds={30} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {flashSaleProducts.map(product => (
            <div key={product.id} className="transform hover:scale-105 transition-all duration-300">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}