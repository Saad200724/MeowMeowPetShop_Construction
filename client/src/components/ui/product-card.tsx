import { Heart, ShoppingCart, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

interface Product {
  id?: number | string;
  _id?: string;
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
  const { addItem, state } = useCart();
  const { toast } = useToast();

  const productId = product.id?.toString() ?? product._id;
  const isInCart = state.items.some((item) => item.id === productId);
  const isAddingToCart = false; // Placeholder for actual adding state

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
        maxStock: 100, // Default max stock
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

  const renderStars = (rating?: number) => {
    // Default to 5 stars for static display as requested
    const displayRating = rating || 5;

    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            size={12}
            className={
              index < displayRating
                ? "text-yellow-400 fill-current"
                : "text-gray-300"
            }
          />
        ))}
        {product.reviews !== undefined && (
          <span className="text-gray-600 text-xs ml-1">
            ({product.reviews})
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
      href={`/product/${product.id?.toString() ?? product._id}`}
      data-testid={`product-link-${product.id?.toString() ?? product._id}`}
    >
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group border border-gray-100 flex flex-col w-[160px] h-[280px] sm:h-[306px] cursor-pointer">
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
          <div
            className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold ${getBadgeStyles(product.badgeColor)} z-10`}
          >
            {product.badge}
          </div>
        )}

        {/* Like Button */}
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={handleLikeClick}
            className="bg-white/80 backdrop-blur-sm p-1.5 rounded-full text-gray-400 hover:text-red-500 transition-all duration-200 shadow-sm hover:shadow-md hover:bg-white hover:bg-opacity-100 active:scale-95"
            data-testid="like-button"
          >
            <Heart size={14} />
          </button>
        </div>

        {/* Product Image - E-commerce Standard */}
        <div className="relative overflow-hidden bg-white rounded-t-2xl h-32 flex items-center justify-center flex-shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Product Content - Improved Layout */}
        <div className="px-3 pt-3 pb-0 flex flex-col space-y-1 flex-1">
          {/* Product Name - Left Aligned */}
          <h4 className="font-semibold text-sm text-gray-900 group-hover:text-[#26732d] transition-colors line-clamp-2 leading-tight text-left">
            {product.name}
          </h4>

          {/* Rating - Left Aligned */}
          <div className="flex items-center justify-start">
            {renderStars(product.rating)}
          </div>

          {/* Price Section - Left Aligned and Well Structured */}
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-[#26732d]">
                ৳
                {typeof product.price === "string"
                  ? product.price
                  : product.price.toLocaleString()}
              </span>
              {oldPriceValue && (
                <span className="text-sm text-gray-500 line-through">
                  ৳
                  {typeof oldPriceValue === "string"
                    ? oldPriceValue
                    : oldPriceValue.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Stock Display - Only visible on desktop/laptop (hidden on mobile) */}
          {(product.stock || product.stockStatus) && (
            <div className="hidden sm:block text-sm text-gray-600 mb-1">
              {typeof product.stock === 'number' ? `Stock: ${product.stock}` : product.stock || product.stockStatus}
            </div>
          )}

          {/* Add to Cart Button */}
          <div>
            <Button
              variant={isInCart ? "default" : "outline"}
              size="sm"
              className={cn(
                "w-full rounded-full py-2 transition-all duration-200 border-2",
                isInCart
                  ? "bg-[#26732d] border-[#26732d] text-white hover:bg-[#1e5d26]"
                  : "border-gray-200 text-gray-700 hover:border-[#26732d] hover:text-[#26732d] hover:bg-[#26732d]/5",
              )}
              disabled={
                product.stock === "0" ||
                product.stockStatus === "Out of Stock" ||
                isAddingToCart
              }
              onClick={handleAddToCart}
              data-testid={`add-to-cart-${product.id?.toString() ?? product._id}`}
            >
              {isAddingToCart ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : isInCart ? (
                <>
                  <Check size={16} className="mr-1" />
                  Added
                </>
              ) : (
                <>
                  <ShoppingCart size={16} className="mr-1" />
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
