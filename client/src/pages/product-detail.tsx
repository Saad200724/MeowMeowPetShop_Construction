import { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Heart, ShoppingCart, Star, Minus, Plus, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/cart-context';
import { useToast } from '@/hooks/use-toast';
import ProductCard from '@/components/ui/product-card';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { cn } from '@/lib/utils';

interface Product {
  _id?: string;
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  category: string;
  rating?: number;
  reviews?: number;
  stock?: string | number;
  stockStatus?: string;
  description?: string;
  weight?: string;
  ingredients?: string[];
  features?: string[];
  isBestSeller?: boolean;
  isNew?: boolean;
  isLowStock?: boolean;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { addItem, updateQuantity, state } = useCart();
  const { toast } = useToast();

  // Fetch product details
  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ['/api/products', id],
    enabled: !!id,
  });

  // Fetch related products  
  const { data: relatedProducts = [] } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const productId = product?.id ?? product?._id;
  const isInCart = state.items.some((item) => item.id === productId);
  const isOutOfStock = product?.stock === "0" || product?.stock === 0 || product?.stockStatus === "Out of Stock";

  const handleAddToCart = () => {
    if (!product || isOutOfStock) return;

    const productId = product.id ?? product._id;
    const maxStock = typeof product.stock === 'number' ? product.stock : 100;
    
    // Check if item already exists in cart
    const existingItem = state.items.find(item => item.id === productId);
    
    if (existingItem) {
      // If item exists, update its quantity
      const newQuantity = Math.min(existingItem.quantity + quantity, maxStock);
      updateQuantity(productId, newQuantity);
    } else {
      // Add new item once
      addItem({
        id: productId,
        name: product.name,
        price: product.price,
        image: product.image,
        maxStock: maxStock,
      });
      
      // If quantity > 1, update to the desired quantity
      if (quantity > 1) {
        setTimeout(() => {
          updateQuantity(productId, Math.min(quantity, maxStock));
        }, 0);
      }
    }

    toast({
      title: "Added to Cart",
      description: `${quantity} x ${product.name} added to your cart.`,
    });
  };

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const renderStars = (rating: number = 5) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}
      />
    ));
  };

  const getFilteredRelatedProducts = () => {
    if (!product || !relatedProducts) return [];
    const productId = product.id ?? product._id;
    return relatedProducts
      .filter((p) => {
        const relatedProductId = p.id ?? p._id;
        return relatedProductId !== productId && p.category === product.category;
      })
      .slice(0, 4);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountAmount = hasDiscount ? (product.originalPrice! - product.price) : 0;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="text-sm breadcrumbs mb-6">
          <div className="flex items-center space-x-2 text-gray-500">
            <span>Home</span>
            <span>/</span>
            <span>{product.category}</span>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </nav>

        {/* Product Details */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div 
              className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden cursor-zoom-in"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleImageMouseMove}
              data-testid="product-image-main"
            >
              <img
                src={product.image}
                alt={product.name}
                className={cn(
                  "w-full h-full object-cover transition-transform duration-300",
                  isZoomed && "scale-150"
                )}
                style={
                  isZoomed
                    ? {
                        transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                      }
                    : {}
                }
              />
              
              {/* Badges */}
              {hasDiscount && (
                <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                  -৳{discountAmount}
                </Badge>
              )}
              {product.isBestSeller && (
                <Badge className="absolute top-4 right-4 bg-yellow-500 text-white">
                  Best Seller
                </Badge>
              )}
              {product.isNew && (
                <Badge className="absolute top-4 right-4 bg-blue-500 text-white">
                  New
                </Badge>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2" data-testid="product-name">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {renderStars(product.rating)}
                </div>
                <span className="text-sm text-gray-600">
                  ({product.reviews || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-green-600" data-testid="product-price">
                  ৳{product.price}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-gray-500 line-through">
                    ৳{product.originalPrice}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                <span className={cn(
                  "text-sm font-medium",
                  isOutOfStock ? "text-red-600" : "text-green-600"
                )}>
                  {isOutOfStock ? "Out of Stock" : "In Stock"}
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    data-testid="quantity-decrease"
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center" data-testid="quantity-display">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    data-testid="quantity-increase"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={cn(
                  "w-full py-3 text-lg font-medium",
                  isOutOfStock
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                )}
                data-testid="add-to-cart-button"
              >
                <ShoppingCart className="mr-2" size={20} />
                {isOutOfStock ? "Out of Stock" : isInCart ? "Add More" : "Add to Cart"}
              </Button>
              
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" data-testid="add-to-wishlist">
                  <Heart size={16} className="mr-2" />
                  Add to Wishlist
                </Button>
                <Button variant="outline" className="flex-1" data-testid="share-product">
                  <Share size={16} className="mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-12">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {product.description && (
                    <div>
                      <h3 className="font-semibold mb-2">Product Description</h3>
                      <p className="text-gray-700">{product.description}</p>
                    </div>
                  )}
                  
                  {product.weight && (
                    <div>
                      <h3 className="font-semibold mb-2">Weight</h3>
                      <p className="text-gray-700">{product.weight}</p>
                    </div>
                  )}
                  
                  {product.ingredients && product.ingredients.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Ingredients</h3>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {product.ingredients.map((ingredient: string, index: number) => (
                          <li key={index}>{ingredient}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {product.features && product.features.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Features</h3>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {product.features.map((feature: string, index: number) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <h3 className="font-semibold mb-2">Customer Reviews</h3>
                  <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {getFilteredRelatedProducts().length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {getFilteredRelatedProducts().map((relatedProduct: Product) => (
                <ProductCard
                  key={relatedProduct.id ?? relatedProduct._id}
                  product={relatedProduct}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}