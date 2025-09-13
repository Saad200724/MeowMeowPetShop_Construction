
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, ShoppingCart, Star, Check } from 'lucide-react'
import { Product } from '@/lib/product-data'
import { Product as HookProduct } from '@/hooks/use-products'
import { useCart } from '@/contexts/cart-context'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: Product | HookProduct
  className?: string
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { addItem, getItemQuantity } = useCart()
  const { toast } = useToast()
  
  const itemQuantity = getItemQuantity(product.id)
  const isInCart = itemQuantity > 0

  const handleAddToCart = async () => {
    if (product.stock === 0) return
    
    setIsAddingToCart(true)
    
    try {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        maxStock: product.stock
      })
      
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star 
        key={index} 
        size={12} 
        className={index < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'} 
      />
    ))
  }

  const getBadgeColor = (product: Product) => {
    if (product.isBestSeller) return 'bg-yellow-500 text-white'
    if (product.isNew) return 'bg-blue-500 text-white'
    if (product.isLowStock) return 'bg-red-500 text-white'
    return 'bg-gray-500 text-white'
  }

  const getBadgeText = (product: Product) => {
    if (product.isBestSeller) return 'Best Seller'
    if (product.isNew) return 'New'
    if (product.isLowStock) return 'Low Stock'
    return null
  }

  const badgeText = getBadgeText(product)
  const hasDiscount = product.originalPrice && product.originalPrice > product.price

  return (
    <Card className={cn('group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden bg-white border border-gray-100 rounded-2xl w-full max-w-[160px] md:max-w-[280px] h-[240px] md:h-[420px] flex flex-col', className)}>
      {/* Discount Badge */}
      {hasDiscount && (
        <Badge className="absolute top-3 left-3 z-10 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          -৳{(product.originalPrice! - product.price).toLocaleString()}
        </Badge>
      )}

      {/* Other Badges */}
      {badgeText && !hasDiscount && (
        <Badge 
          className={cn(
            'absolute top-3 left-3 z-10 text-xs font-bold px-2 py-1 rounded-full',
            getBadgeColor(product)
          )}
        >
          {badgeText}
        </Badge>
      )}

      {/* Like Button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-sm hover:bg-white p-2 rounded-full shadow-sm"
        onClick={() => setIsLiked(!isLiked)}
      >
        <Heart 
          size={16} 
          className={cn(
            'transition-colors',
            isLiked ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-500'
          )} 
        />
      </Button>

      {/* Product Image */}
      <div className="relative overflow-hidden bg-gray-50 rounded-t-2xl p-2 md:p-4 h-28 md:h-48 flex-shrink-0">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" 
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <CardContent className="p-2 md:p-4 flex flex-col flex-1 justify-between">
        <div className="space-y-3 flex-1">
          {/* Category Tag */}
          {product.tags && product.tags.length > 0 && (
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              {product.tags[0]}
            </div>
          )}

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 text-xs md:text-sm leading-tight line-clamp-2 group-hover:text-[#26732d] transition-colors min-h-[2rem] md:min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Rating - Only show if exists */}
          {product.rating > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                {renderStars(product.rating)}
              </div>
              <span className="text-xs text-gray-500">
                ({product.reviews})
              </span>
            </div>
          )}

          {/* Price Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-base md:text-lg font-bold text-[#26732d]">
                ৳{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-xs md:text-sm text-gray-500 line-through">
                  ৳{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            
            {/* Stock Status */}
            <div className="text-xs text-gray-500">
              {product.stock > 0 ? (
                <span className={cn(
                  'font-medium',
                  product.stock < 10 ? 'text-orange-600' : 'text-green-600'
                )}>
                  {product.stock < 10 ? `Only ${product.stock} left` : 'In Stock'}
                </span>
              ) : (
                <span className="text-red-600 font-medium">Out of Stock</span>
              )}
            </div>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button 
          variant={isInCart ? "default" : "outline"}
          size="sm"
          className={cn(
            "w-full rounded-full py-2 transition-all duration-200 border-2 mt-4",
            isInCart 
              ? "bg-[#26732d] border-[#26732d] text-white hover:bg-[#1e5d26]" 
              : "border-gray-200 text-gray-700 hover:border-[#26732d] hover:text-[#26732d] hover:bg-[#26732d]/5"
          )}
          disabled={product.stock === 0 || isAddingToCart}
          onClick={handleAddToCart}
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
      </CardContent>
    </Card>
  )
}
