import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Plus, Minus, Package } from 'lucide-react';

export default function RepackFood() {
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({
    1: 1,
    2: 1,
    3: 1
  });

  const updateQuantity = (id: number, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
    }));
  };

  const products = [
    {
      id: 1,
      name: 'Bulk Cat Food Repack (20kg)',
      description: 'Premium quality, repackaged for savings',
      image: 'https://images.unsplash.com/photo-1615497001839-b0a0eac3274c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      price: 6400,
      originalPrice: 8000,
      savings: 20,
      badge: 'BULK SAVE'
    },
    {
      id: 2,
      name: 'Bulk Dog Food Repack (25kg)',
      description: 'Economical choice for multiple dogs',
      image: 'https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      price: 7200,
      originalPrice: 9600,
      savings: 25,
      badge: 'COMBO DEAL'
    },
    {
      id: 3,
      name: 'Mixed Pet Treats (5kg)',
      description: 'Assorted treats for cats and dogs',
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      price: 2800,
      originalPrice: 3500,
      savings: 20,
      badge: 'BULK SAVE'
    }
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-[#26732d] mb-8 flex items-center justify-center gap-3">
          <Package size={32} className="text-[#26732d]" />
          Repack Food - Bulk Save!
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 relative min-h-[400px] flex flex-col">
              <div className="absolute top-2 left-2 bg-yellow-400 text-[#26732d] px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 z-10">
                <Package size={14} />
                {product.badge}
              </div>
              <div className="absolute top-2 right-2 z-10">
                <button className="bg-white bg-opacity-80 p-1.5 rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm">
                  <Heart size={18} />
                </button>
              </div>

              <div className="flex flex-col h-full">
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-48 object-cover rounded-t-lg" 
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h4 className="font-semibold mb-2 text-base text-[#26732d]">{product.name}</h4>
                  <p className="text-sm text-gray-600 mb-3 flex-1">{product.description}</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-[#26732d]">৳{product.price.toLocaleString()}</span>
                        <span className="text-sm text-gray-500 line-through">৳{product.originalPrice.toLocaleString()}</span>
                      </div>
                      <span className="bg-yellow-400 text-[#26732d] font-bold text-xs px-2 py-1 rounded-full whitespace-nowrap">
                        Save {product.savings}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-1">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => updateQuantity(product.id, -1)}
                        >
                          <Minus size={14} />
                        </Button>
                        <span className="font-medium px-2 min-w-[2rem] text-center">{quantities[product.id]}</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => updateQuantity(product.id, 1)}
                        >
                          <Plus size={14} />
                        </Button>
                      </div>
                      <Button className="bg-[#26732d] text-white px-3 py-1.5 rounded-lg hover:bg-[#1e5d26] transition-colors text-sm flex-1 max-w-[120px]">
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}