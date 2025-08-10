import { useState } from 'react';
import { Cat, Dog, Heart, Gift, ShoppingBag, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'wouter';

export default function CategoriesGrid() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const categories = [
    {
      id: 'cat-food',
      name: 'Cat Food & Treats',
      icon: Cat,
      image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&q=80',
      count: '120+ Products',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'dog-food',
      name: 'Dog Food & Treats',
      icon: Dog,
      image: 'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=500&q=80',
      count: '150+ Products',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'toys-treats',
      name: 'Pet Toys & Treats',
      icon: Gift,
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&q=80',
      count: '80+ Products',
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'health-care',
      name: 'Pet Care & Health',
      icon: Heart,
      image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=500&q=80',
      count: '60+ Products',
      color: 'bg-red-100 text-red-600'
    },
    {
      id: 'grooming',
      name: 'Grooming',
      icon: ShoppingBag,
      image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=500&q=80',
      count: '45+ Products',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: 'accessories',
      name: 'Accessories',
      icon: Heart,
      image: 'https://images.unsplash.com/photo-1615789591457-74a63395c990?w=500&q=80',
      count: '90+ Products',
      color: 'bg-pink-100 text-pink-600'
    }
  ];

  return (
    <section className="section-spacing bg-white relative">
      <div className="responsive-container">
        {/* Toggle Button - Top Left */}
        <Button
          variant="outline"
          size="sm"
          className="absolute top-4 left-4 z-10 bg-white shadow-lg"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </Button>

        {/* Header */}
        <div className={cn(
          'transition-all duration-300 overflow-hidden',
          isCollapsed ? 'max-h-0 opacity-0 mb-0' : 'max-h-96 opacity-100 mb-8'
        )}>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#26732d] flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in pt-12">
            <ShoppingBag size={32} className="text-[#26732d]" />
            Shop by Category
          </h2>
        </div>

        {/* Categories Grid */}
        <div className={cn(
          'transition-all duration-500 overflow-hidden',
          isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[1000px] opacity-100'
        )}>
          <div className="responsive-grid">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Link 
                  key={category.id} 
                  href={`/products?category=${category.id}`}
                  className="group cursor-pointer hover-lift animate-fade-in block"
                  style={{ animationDelay: `${index * 0.1}s` } as React.CSSProperties}
                >
                  <div className="relative overflow-hidden rounded-xl shadow-md">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                      <div className={`p-3 rounded-full ${category.color} mb-3 animate-scale-up group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent size={24} />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-center mb-2">{category.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-200">{category.count}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Horizontal Product Access */}
        {!isCollapsed && (
          <div className="mt-8 text-center animate-fade-in">
            <p className="text-gray-600 mb-4">Browse products horizontally by category</p>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Link 
                  key={category.id}
                  href={`/products?category=${category.id}`}
                  className="px-4 py-2 bg-[#26732d] text-white rounded-full hover:bg-[#1e5d26] transition-colors text-sm"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}