import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, ShoppingCart, Star, Check } from 'lucide-react'
import { Product } from '@/lib/product-data'
import { useCart } from '@/contexts/cart-context'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: Product
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
        size={14} 
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

  return (
    <Card className={cn('group hover-lift animate-fade-in relative overflow-hidden', className)}>
      {/* Badges */}
      {badgeText && (
        <Badge 
          className={cn(
            'absolute top-3 left-3 z-10 text-xs font-bold',
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
        className="absolute top-3 right-3 z-10 bg-white bg-opacity-80 hover:bg-white p-2 rounded-full"
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
      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" 
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300"></div>
      </div>

      <CardContent className="p-4">
        {/* Product Name */}
        <h3 className="font-semibold text-[#26732d] mb-2 line-clamp-2 group-hover:text-[#1e5d26] transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center mr-2">
            {renderStars(product.rating)}
          </div>
          <span className="text-sm text-gray-600">
            ({product.reviews} reviews)
          </span>
        </div>

        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Price and Add to Cart */}
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
            <div className="text-xs text-gray-500 mt-1">
              Stock: {product.stock} units
            </div>
          </div>
          
          <Button 
            variant={isInCart ? "default" : "meow"}
            size="sm"
            className="px-3 py-2 rounded-lg shadow-sm btn-bounce"
            disabled={product.stock === 0 || isAddingToCart}
            onClick={handleAddToCart}
          >
            {isAddingToCart ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isInCart ? (
              <Check size={16} />
            ) : (
              <ShoppingCart size={16} />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}