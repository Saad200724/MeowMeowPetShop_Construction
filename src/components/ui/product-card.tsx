import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  reviews?: number;
  badge?: string;
  badgeColor?: string;
  stockStatus?: string;
  isNew?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const getBadgeStyles = (color?: string) => {
    switch (color) {
      case 'red':
        return 'bg-red-600 text-white';
      case 'blue':
        return 'bg-blue-500 text-white';
      case 'yellow':
        return 'meow-yellow text-black';
      case 'green':
        return 'bg-green-600 text-white';
      case 'purple':
        return 'bg-purple-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getStockStatusStyles = (status?: string) => {
    switch (status) {
      case 'In Stock':
        return 'text-green-600';
      case 'Low Stock':
        return 'text-orange-600';
      case 'Out of Stock':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const renderStars = (rating?: number) => {
    if (!rating) return <span className="text-gray-600 text-sm">(New)</span>;
    
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }, (_, index) => (
          <Star 
            key={index} 
            size={14} 
            className={index < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'} 
          />
        ))}
        {product.reviews !== undefined && (
          <span className="text-gray-600 text-sm ml-1">({product.reviews} reviews)</span>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover-lift relative overflow-hidden group animate-fade-in">
      {product.badge && (
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-sm font-bold ${getBadgeStyles(product.badgeColor)} z-10 animate-scale-up`}>
          {product.badge}
        </div>
      )}
      
      <div className="absolute top-3 right-3 z-10">
        <button className="bg-white bg-opacity-80 p-2 rounded-full text-gray-400 hover:text-red-500 transition-all duration-200 shadow-sm hover:shadow-md hover:bg-white hover:bg-opacity-100 active:scale-95">
          <Heart size={18} />
        </button>
      </div>
      
      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" 
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
      </div>
      
      <div className="p-4">
        <h4 className="font-semibold mb-2 text-[#26732d] group-hover:text-[#1e5d26] transition-colors">{product.name}</h4>
        
        <div className="mb-3">
          {renderStars(product.rating)}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-[#26732d]">
                ৳{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ৳{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            {product.stockStatus && (
              <div className={`text-xs font-medium ${getStockStatusStyles(product.stockStatus)} mt-1`}>
                {product.stockStatus}
              </div>
            )}
          </div>
          
          <Button 
            variant="meow"
            size="sm"
            className="px-3 py-2 rounded-lg shadow-sm btn-bounce"
          >
            <ShoppingCart size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
