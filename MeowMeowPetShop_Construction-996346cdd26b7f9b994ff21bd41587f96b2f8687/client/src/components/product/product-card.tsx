import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingCart, Star, Check } from "lucide-react";
import { Product } from "@/lib/product-data";
import { Product as HookProduct } from "@/hooks/use-products";
import { useCart } from "@/contexts/cart-context";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
// Removed getProductSlug import - using persisted slug from server

interface ProductCardProps {
  product: Product | HookProduct;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addItem, getItemQuantity } = useCart();
  const { toast } = useToast();

  // Use the persisted product slug from server
  const productSlug = product.slug || "product";

  const itemQuantity = getItemQuantity(product.id);
  const isInCart = itemQuantity > 0;

  const handleAddToCart = async () => {
    if (product.stock === 0) return;

    setIsAddingToCart(true);

    try {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        maxStock: product.stock,
      });

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const renderStars = (rating: number, reviewCount: number) => {
    // Show 5 stars by default if no reviews, otherwise show actual rating
    const displayRating = reviewCount > 0 ? rating : 5;
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFull = displayRating >= starValue;
      const isHalf = !isFull && displayRating >= starValue - 0.5;
      
      return (
        <div key={index} className="relative inline-block">
          <Star
            size={10}
            className={isFull ? "text-yellow-500 fill-current" : "text-gray-300"}
          />
          {isHalf && (
            <div className="absolute top-0 left-0 overflow-hidden" style={{ width: '50%' }}>
              <Star size={10} className="text-yellow-500 fill-current" />
            </div>
          )}
        </div>
      );
    });
  };

  const getBadgeColor = (product: Product) => {
    if (product.isBestSeller) return "bg-yellow-500 text-white";
    if (product.isNew) return "bg-blue-500 text-white";
    if (product.isLowStock) return "bg-red-500 text-white";
    return "bg-gray-500 text-white";
  };

  const getBadgeText = (product: Product) => {
    if (product.isBestSeller) return "Best Seller";
    if (product.isNew) return "New";
    if (product.isLowStock) return "Low Stock";
    return null;
  };

  const badgeText = getBadgeText(product);
  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;

  return (
    <Link href={`/product/${productSlug}`}>
      <Card
        className={cn(
          "group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden bg-white border border-gray-100 rounded-2xl w-full max-w-[200px] mx-auto h-[280px] sm:h-[280px] md:h-[280px] lg:h-[280px] flex flex-col cursor-pointer",
          className,
        )}
      >
      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold bg-red-500 text-white z-10">
          -৳{(product.originalPrice! - product.price).toLocaleString()}
        </div>
      )}

      {/* Other Badges */}
      {badgeText && !hasDiscount && (
        <div
          className={cn(
            "absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold z-10",
            getBadgeColor(product),
          )}
        >
          {badgeText}
        </div>
      )}

      {/* Like Button */}
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="bg-white/80 backdrop-blur-sm p-1.5 rounded-full text-gray-400 hover:text-red-500 transition-all duration-200 shadow-sm hover:shadow-md hover:bg-white hover:bg-opacity-100 active:scale-95"
        >
          <Heart
            size={14}
            className={cn(
              "transition-colors",
              isLiked ? "text-red-500 fill-current" : "",
            )}
          />
        </button>
      </div>

      {/* Product Image */}
      <div className="relative overflow-hidden bg-white rounded-t-2xl h-28 sm:h-28 md:h-28 lg:h-28 flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <CardContent className="px-3 pt-2 pb-3 flex flex-col flex-1">
        <div className="space-y-1">
          {/* Category Tag */}
          {product.tags && product.tags.length > 0 && (
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              {product.tags[0]}
            </div>
          )}

          {/* Product Name */}
          <h3 className="font-semibold text-lg text-gray-900 leading-tight line-clamp-2 group-hover:text-[#26732d] transition-colors text-left">
            {product.name}
          </h3>

          {/* Rating - Always show */}
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {renderStars(product.rating || 0, product.reviews || 0)}
            </div>
            {product.reviews > 0 && (
              <span className="text-xs text-gray-500">({product.reviews})</span>
            )}
          </div>

          {/* Price Section */}
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-[#26732d]">
                ৳{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ৳{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="mt-auto mb-2">
          <Button
            variant={isInCart ? "default" : "outline"}
            size="sm"
            className={cn(
              "w-full rounded-full py-1.5 text-sm transition-all duration-200 border-2",
              isInCart
                ? "bg-[#26732d] border-[#26732d] text-white hover:bg-[#1e5d26]"
                : "border-gray-200 text-gray-700 hover:border-[#26732d] hover:text-[#26732d] hover:bg-[#26732d]/5",
            )}
            disabled={product.stock === 0 || isAddingToCart}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart();
            }}
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
      </CardContent>
    </Card>
    </Link>
  );
}
