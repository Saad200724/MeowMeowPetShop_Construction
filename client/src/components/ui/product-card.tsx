import { Heart, ShoppingCart, Star, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { Product } from '@/lib/product-data';
import { Product as HookProduct } from '@/hooks/use-products';
// Removed getProductSlug import - using persisted slug from server

type UIProduct = (Product | HookProduct) & {
  _id?: string;
  oldPrice?: string | number;
  discount?: string;
  badge?: string;
  badgeColor?: string;
  stockStatus?: string;
  isNew?: boolean;
  originalPrice?: number;
  availableColors?: string[];
  availableWeights?: string[];
};

interface ProductCardProps {
  product: UIProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, state } = useCart();
  const { toast } = useToast();

  // Use the persisted product slug from server
  const productSlug = (product as any).slug || 'product';

  const productId = product.id?.toString() ?? product._id;
  const isInCart = state.items.some((item) => item.id === productId);
  const isAddingToCart = false; // Placeholder for actual adding state

  const hasColors = product.availableColors && product.availableColors.length > 1;
  const hasWeights = product.availableWeights && product.availableWeights.length > 1;
  const showInfoOnly = hasColors || hasWeights;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (showInfoOnly) {
      window.location.href = `/product/${productSlug}`;
      return;
    }

    const productId = product.id?.toString() ?? product._id;
    if (productId) {
      addItem({
        id: productId,
        name: product.name,
        price:
          typeof product.price === "string"
            ? parseFloat(product.price)
            : product.price,
        image: product.image,
        maxStock: product.stock || 100, // Use actual stock or default
      });
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Like functionality can be added here
  };

  const getBadgeStyles = (color?: string) => {
    switch (color) {
      case "red":
        return "bg-red-500 text-white";
      case "blue":
        return "bg-blue-500 text-white";
      case "yellow":
        return "bg-yellow-500 text-white";
      case "green":
        return "bg-green-500 text-white";
      case "purple":
        return "bg-purple-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStockStatusStyles = (status?: string) => {
    switch (status) {
      case "In Stock":
        return "text-green-600";
      case "Low Stock":
        return "text-orange-600";
      case "Out of Stock":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const renderStars = (rating: number, reviewCount: number) => {
    // Show 5 stars by default if no reviews, otherwise show actual rating
    const displayRating = reviewCount > 0 ? rating : 5;

    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, index) => {
          const starValue = index + 1;
          const isFull = displayRating >= starValue;
          const isHalf = !isFull && displayRating >= starValue - 0.5;
          
          return (
            <div key={index} className="relative inline-block">
              <Star
                size={10}
                className={isFull ? "text-yellow-400 fill-current" : "text-gray-300"}
              />
              {isHalf && (
                <div className="absolute top-0 left-0 overflow-hidden" style={{ width: '50%' }}>
                  <Star size={10} className="text-yellow-400 fill-current" />
                </div>
              )}
            </div>
          );
        })}
        {reviewCount > 0 && (
          <span className="text-gray-600 text-xs ml-1">
            ({reviewCount})
          </span>
        )}
      </div>
    );
  };

  // Handle both new interface (oldPrice/discount) and legacy interface (originalPrice)
  const oldPriceValue = product.oldPrice || product.originalPrice;
  const currentPrice =
    typeof product.price === "string"
      ? parseFloat(product.price)
      : product.price;
  const originalPriceValue =
    typeof oldPriceValue === "string"
      ? parseFloat(oldPriceValue)
      : oldPriceValue;
  const hasDiscount = originalPriceValue && originalPriceValue > currentPrice;

  return (
    <Link
      href={`/product/${productSlug}`}
      data-testid={`product-link-${productSlug}`}
    >
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group border border-gray-100 flex flex-col w-full h-full min-h-[200px] md:min-h-[400px] cursor-pointer">
        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-full text-[8px] font-bold bg-red-500 text-white z-10 shadow-sm">
            {product.discount}
          </div>
        )}
        {hasDiscount && !product.discount && (
          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-full text-[8px] font-bold bg-red-500 text-white z-10 shadow-sm">
            -৳{Math.round(originalPriceValue! - currentPrice).toLocaleString()}
          </div>
        )}

        {/* Other Badges */}
        {product.badge && !hasDiscount && (
          <div
            className={cn(
              "absolute top-2 left-2 px-1.5 py-0.5 rounded-full text-[8px] font-bold z-10 shadow-sm",
              getBadgeStyles(product.badgeColor)
            )}
          >
            {product.badge}
          </div>
        )}

        {/* Like Button */}
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={handleLikeClick}
            className="bg-white/90 backdrop-blur-sm p-1 rounded-full text-gray-400 hover:text-red-500 transition-all duration-200 shadow-sm hover:shadow-md hover:bg-white active:scale-95"
            data-testid="like-button"
          >
            <Heart size={10} />
          </button>
        </div>

        {/* Product Image - Professional E-commerce Standard */}
        <div className="relative overflow-hidden bg-white aspect-square md:h-48 flex items-center justify-center flex-shrink-0 p-1.5 md:p-3">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
        </div>

        {/* Product Content - Improved Professional Layout */}
        <div className="p-1.5 md:p-3 flex flex-col flex-1 justify-between gap-1 md:gap-2">
          <div className="space-y-0.5 md:space-y-1.5">
            {/* Product Name - Balanced Weight */}
            <h4 className="font-medium text-[9px] md:text-sm text-gray-800 group-hover:text-[#26732d] transition-colors line-clamp-2 leading-tight text-left h-5 md:h-10">
              {product.name}
            </h4>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center">
                {renderStars(product.rating || 0, product.reviews || 0)}
              </div>
              {product.reviews > 0 && (
                <span className="text-[10px] text-gray-400 font-medium">({product.reviews})</span>
              )}
            </div>

            {/* Price Section - Clear Visual Hierarchy */}
            <div className="flex items-baseline flex-wrap gap-1.5">
              <span className="text-sm md:text-base font-bold text-[#26732d]">
                ৳{typeof product.price === "string" ? product.price : product.price.toLocaleString()}
              </span>
              {oldPriceValue && (
                <span className="text-[10px] md:text-xs text-gray-400 line-through decoration-red-400/50">
                  ৳{typeof oldPriceValue === "string" ? oldPriceValue : oldPriceValue.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart - Action Oriented */}
          <div className="pt-1">
            <Button
              variant={showInfoOnly ? "outline" : (isInCart ? "default" : "outline")}
              size="sm"
              className={cn(
                "w-full rounded-lg h-8 md:h-9 text-[10px] md:text-xs font-semibold transition-all duration-300",
                isInCart
                  ? "bg-[#26732d] border-[#26732d] text-white hover:bg-[#1e5d26] shadow-sm"
                  : "border-gray-200 text-gray-700 hover:border-[#26732d] hover:text-[#26732d] hover:bg-[#26732d]/5",
              )}
              disabled={
                !showInfoOnly && (
                  product.stock === 0 ||
                  product.stockStatus === "Out of Stock" ||
                  isAddingToCart
                )
              }
              onClick={handleAddToCart}
            >
              {isAddingToCart ? (
                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : showInfoOnly ? (
                <>
                  <Info size={14} className="mr-1.5" />
                  Details
                </>
              ) : isInCart ? (
                <>
                  <Check size={14} className="mr-1.5" />
                  In Cart
                </>
              ) : (
                <>
                  <ShoppingCart size={14} className="mr-1.5" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}