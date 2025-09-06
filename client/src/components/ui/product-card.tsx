
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
        return 'bg-red-500 text-white';
      case 'blue':
        return 'bg-blue-500 text-white';
      case 'yellow':
        return 'bg-yellow-500 text-white';
      case 'green':
        return 'bg-green-500 text-white';
      case 'purple':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-gray-500 text-white';
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
    if (!rating) return <span className="text-gray-600 text-xs">(New)</span>;
    
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, index) => (
          <Star 
            key={index} 
            size={10} 
            className={index < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'} 
          />
        ))}
        {product.reviews !== undefined && (
          <span className="text-gray-600 text-xs ml-1">({product.reviews})</span>
        )}
      </div>
    );
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group border border-gray-100 h-[280px] flex flex-col">
      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold bg-pink-500 text-white z-10">
          -৳{(product.originalPrice! - product.price).toLocaleString()}
        </div>
      )}

      {/* Other Badges */}
      {product.badge && !hasDiscount && (
        <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold ${getBadgeStyles(product.badgeColor)} z-10`}>
          {product.badge}
        </div>
      )}
      
      {/* Like Button */}
      <div className="absolute top-2 right-2 z-10">
        <button className="bg-white/80 backdrop-blur-sm p-1.5 rounded-full text-gray-400 hover:text-red-500 transition-all duration-200 shadow-sm hover:shadow-md hover:bg-white hover:bg-opacity-100 active:scale-95">
          <Heart size={14} />
        </button>
      </div>
      
      {/* Product Image */}
      <div className="relative overflow-hidden bg-gray-50 rounded-t-2xl">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110" 
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      {/* Product Content */}
      <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-2">
          {/* Product Name */}
          <h4 className="font-semibold text-sm text-gray-900 group-hover:text-[#26732d] transition-colors line-clamp-2 leading-tight min-h-[2.5rem]">
            {product.name}
          </h4>
          
          {/* Rating */}
          <div className="flex items-center">
            {renderStars(product.rating)}
          </div>
        </div>
        
        {/* Price and Actions */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-base font-bold text-[#26732d]">
                  ৳{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-gray-500 line-through">
                    ৳{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              {product.stockStatus && (
                <div className={`text-xs font-medium ${getStockStatusStyles(product.stockStatus)}`}>
                  {product.stockStatus}
                </div>
              )}
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <Button 
            variant="outline"
            size="sm"
            className="w-full rounded-full border-2 border-gray-200 text-gray-700 hover:border-[#26732d] hover:text-[#26732d] hover:bg-[#26732d]/5 transition-all duration-200 h-8"
          >
            <ShoppingCart size={14} className="mr-1" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
