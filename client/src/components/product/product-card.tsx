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
  const productSlug = (product as any).slug || "product";

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
          "group hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative overflow-hidden bg-white border border-gray-100 rounded-xl w-full h-full min-h-[200px] md:min-h-[400px] flex flex-col cursor-pointer p-0",
          className,
        )}
      >
      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white z-10 shadow-sm">
          -৳{(product.originalPrice! - product.price).toLocaleString()}
        </div>
      )}

      {/* Other Badges */}
      {badgeText && !hasDiscount && (
        <div
          className={cn(
            "absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold z-10 shadow-sm",
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
          className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full text-gray-400 hover:text-red-500 transition-all duration-200 shadow-sm hover:shadow-md hover:bg-white active:scale-95"
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
      <div className="relative overflow-hidden bg-white aspect-square md:h-48 flex-shrink-0 p-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
      </div>

      <CardContent className="p-3 flex flex-col flex-1 justify-between gap-2">
        <div className="space-y-1.5">
          {/* Category Tag */}
          {product.tags && product.tags.length > 0 && (
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              {product.tags[0]}
            </div>
          )}

          {/* Product Name */}
          <h3 className="font-medium text-xs md:text-sm text-gray-800 leading-snug line-clamp-2 group-hover:text-[#26732d] transition-colors text-left h-8 md:h-10">
            {product.name}
          </h3>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center">
              {renderStars(product.rating || 0, product.reviews || 0)}
            </div>
            {product.reviews > 0 && (
              <span className="text-[10px] text-gray-400 font-medium">({product.reviews})</span>
            )}
          </div>

          {/* Price Section */}
          <div className="flex items-baseline flex-wrap gap-1 md:gap-1.5">
            <span className="text-xs md:text-base font-bold text-[#26732d]">
              ৳{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-[9px] md:text-xs text-gray-400 line-through decoration-red-400/50">
                ৳{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="pt-1">
          <Button
            variant={isInCart ? "default" : "outline"}
            size="sm"
            className={cn(
              "w-full rounded-lg h-8 md:h-9 text-[10px] md:text-xs font-semibold transition-all duration-300",
              isInCart
                ? "bg-[#26732d] border-[#26732d] text-white hover:bg-[#1e5d26] shadow-sm"
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
              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
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
      </CardContent>
    </Card>
    </Link>
  );
}
