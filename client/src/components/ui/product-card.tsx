
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Product {
  id?: number;
  name: string;
  image: string;
  price: string | number;
  oldPrice?: string | number;
  discount?: string;
  stock?: string;
  rating?: number;
  reviews?: number;
  badge?: string;
  badgeColor?: string;
  stockStatus?: string;
  isNew?: boolean;
  // Legacy support
  originalPrice?: number;
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
    // Default to 5 stars for static display as requested
    const displayRating = rating || 5;
    
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, index) => (
          <Star 
            key={index} 
            size={12} 
            className={index < displayRating ? 'text-yellow-400 fill-current' : 'text-gray-300'} 
          />
        ))}
        {product.reviews !== undefined && (
          <span className="text-gray-600 text-xs ml-1">({product.reviews})</span>
        )}
      </div>
    );
  };

  // Handle both new interface (oldPrice/discount) and legacy interface (originalPrice)
  const oldPriceValue = product.oldPrice || product.originalPrice;
  const currentPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const originalPriceValue = typeof oldPriceValue === 'string' ? parseFloat(oldPriceValue) : oldPriceValue;
  const hasDiscount = originalPriceValue && originalPriceValue > currentPrice;

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group border border-gray-100 h-[360px] flex flex-col">
      {/* Discount Badge */}
      {product.discount && (
        <div className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold bg-red-500 text-white z-10">
          {product.discount}
        </div>
      )}
      {hasDiscount && !product.discount && (
        <div className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold bg-red-500 text-white z-10">
          -৳{Math.round(originalPriceValue! - currentPrice).toLocaleString()}
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
      
      {/* Product Image - E-commerce Standard */}
      <div className="relative overflow-hidden bg-white rounded-t-2xl h-56 flex items-center justify-center">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-105" 
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      {/* Product Content - Compact */}
      <div className="p-3 flex flex-col justify-between space-y-1.5">
        {/* Product Name - More Compact */}
        <h4 className="font-semibold text-sm text-gray-900 group-hover:text-[#26732d] transition-colors line-clamp-1 leading-tight">
          {product.name}
        </h4>
        
        {/* Rating - Smaller */}
        <div className="flex items-center">
          {renderStars(product.rating)}
        </div>
        
        {/* Price and Actions - Compact */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-base font-bold text-green-600">
                  ৳{typeof product.price === 'string' ? product.price : product.price.toLocaleString()}
                </span>
                {oldPriceValue && (
                  <span className="text-xs text-red-500 line-through">
                    ৳{typeof oldPriceValue === 'string' ? oldPriceValue : oldPriceValue.toLocaleString()}
                  </span>
                )}
              </div>
              {(product.stock || product.stockStatus) && (
                <div className={`text-xs font-medium ${getStockStatusStyles(product.stock || product.stockStatus)}`}>
                  {product.stock || product.stockStatus}
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
