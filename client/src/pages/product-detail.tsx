import { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Heart, ShoppingCart, Star, Minus, Plus, Share, Facebook, Twitter, Instagram, Copy, Send, Truck, MapPin, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/contexts/cart-context';
import { useToast } from '@/hooks/use-toast';
import ProductCard from '@/components/ui/product-card';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { cn } from '@/lib/utils';
import { Product as BaseProduct } from '@/lib/product-data';
import { findProductBySlug } from '@/lib/slug-utils';

type DetailProduct = BaseProduct & {
  _id?: string;
  categorySlug?: string;
  categoryName?: string;
  stockStatus?: string;
  stockQuantity?: number;
  weight?: string;
  ingredients?: string[];
  features?: string[];
  availableWeights?: string[];
  availableColors?: string[];
};

export default function ProductDetailPage() {
  const { id: slug } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const { addItem, updateQuantity, state } = useCart();
  const { toast } = useToast();

  // Set default selections when product loads
  useEffect(() => {
    if (product) {
      if (product.availableWeights && product.availableWeights.length > 0) {
        setSelectedWeight(product.availableWeights[0]);
      }
      if (product.availableColors && product.availableColors.length > 0) {
        setSelectedColor(product.availableColors[0]);
      }
    }
  }, [product]);

  // Fetch product directly by slug from the new API endpoint, with fallback to repack products
  const { data: product, isLoading } = useQuery<DetailProduct>({ 
    queryKey: ['/api/products/slug', slug],
    queryFn: async () => {
      // Try to fetch from regular products first
      const response = await fetch(`/api/products/slug/${slug}`);
      if (response.ok) {
        return response.json();
      }
      
      // Fallback: Search in repack products
      const repackResponse = await fetch('/api/repack-products');
      if (repackResponse.ok) {
        const repackProducts = await repackResponse.json();
        // Find product by ID (treating slug as ID for repack products)
        const foundProduct = repackProducts.find((p: any) => 
          (p._id === slug || p.id === slug || 
           p.name?.toLowerCase().replace(/\s+/g, '-') === slug?.toLowerCase())
        );
        if (foundProduct) {
          // Enrich with full details
          return {
            ...foundProduct,
            id: foundProduct._id || foundProduct.id,
            slug: slug,
            categoryName: 'Repack Products',
            tags: foundProduct.tags || ['repack']
          };
        }
      }
      
      throw new Error('Product not found');
    },
    enabled: !!slug, // Only run query if slug exists
  });

  // Get productId from product data
  const productId = product?.id ?? product?._id;

  // Fetch all products for related products section
  const { data: allProducts = [] } = useQuery<DetailProduct[]>({
    queryKey: ['/api/products'],
  });

  // Fetch reviews for this product
  const { data: reviews = [], refetch: refetchReviews } = useQuery<any[]>({
    queryKey: ['/api/reviews/product', productId],
    queryFn: async () => {
      if (!productId) return [];
      const response = await fetch(`/api/reviews/product/${productId}`);
      if (!response.ok) return [];
      return response.json();
    },
    enabled: !!productId,
  });

  // Filter related products (exclude current product)
  const relatedProducts = allProducts.filter(p => {
    const currentProductId = product?.id ?? product?._id;
    const relatedProductId = p.id ?? p._id;
    return relatedProductId !== currentProductId;
  }).slice(0, 8);

  // Reset selected image when product changes
  useEffect(() => {
    setSelectedImage(0);
  }, [productId]);

  // SEO meta tags
  useEffect(() => {
    if (product) {
      document.title = `${product.name} - Meow Meow Pet Shop`;
      const metaDescription = document.querySelector('meta[name="description"]');
      const description = product.description || `Buy ${product.name} at Meow Meow Pet Shop. Quality pet products with delivery in Dhaka and across Bangladesh.`;
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = description;
        document.head.appendChild(meta);
      }
    }
  }, [product]);

  const isInCart = state.items.some((item) => item.id === productId);
  const isOutOfStock = product?.stockQuantity === 0 || product?.stockStatus === "Out of Stock";

  const handleAddToCart = () => {
    if (!product || isOutOfStock) return;

    const maxStock = product.stockQuantity || 100;
    
    // Create a unique cart key that includes selected variations
    const cartItemId = `${productId}-${selectedWeight || 'default'}-${selectedColor || 'default'}`;
    
    // Check if item with same variations already exists in cart
    const existingItem = state.items.find(item => item.id === cartItemId);
    
    if (existingItem) {
      const newQuantity = Math.min(existingItem.quantity + quantity, maxStock);
      updateQuantity(cartItemId, newQuantity);
    } else {
      addItem({
        id: cartItemId,
        productId: productId,
        name: product.name,
        price: product.price,
        image: product.image,
        maxStock: maxStock,
        weight: selectedWeight,
        color: selectedColor,
      });
      
      if (quantity > 1) {
        setTimeout(() => {
          updateQuantity(cartItemId, Math.min(quantity, maxStock));
        }, 0);
      }
    }

    toast({
      title: "Added to Cart",
      description: `${quantity} x ${product.name}${selectedWeight ? ` (${selectedWeight})` : ''}${selectedColor ? ` [${selectedColor.split(':')[0]}]` : ''} added to your cart.`,
    });
  };

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const handleShare = (platform: string) => {
    const productUrl = `${window.location.origin}/product/${slug}`;
    const productTitle = product?.name || 'Check out this product';
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(productTitle)}&url=${encodeURIComponent(productUrl)}`, '_blank');
        break;
      case 'instagram':
        // Instagram doesn't have direct URL sharing, copy link instead
        navigator.clipboard.writeText(productUrl);
        toast({ title: "Link copied!", description: "Share this link on Instagram" });
        break;
      case 'pinterest':
        window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(productUrl)}&description=${encodeURIComponent(productTitle)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(productUrl);
        toast({ title: "Link copied!", description: "Product link copied to clipboard" });
        break;
    }
    setIsShareOpen(false);
  };

  const handleSubmitReview = async () => {
    if (!userName.trim() || !reviewText.trim() || userRating === 0) {
      toast({
        title: "Please complete all fields",
        description: "Name, rating, and review text are required.",
        variant: "destructive"
      });
      return;
    }

    if (!productId) {
      toast({
        title: "Error",
        description: "Product ID not found.",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          userName: userName.trim(),
          userEmail: userEmail.trim() || undefined,
          rating: userRating,
          comment: reviewText.trim(),
          userId: localStorage.getItem('userId') || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit review');
      }

      toast({
        title: "Review submitted!",
        description: "Thank you for your feedback.",
      });
      
      // Reset form
      setUserName('');
      setUserEmail('');
      setReviewText('');
      setUserRating(0);
      
      // Refetch reviews
      refetchReviews();
    } catch (error) {
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive"
      });
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
            size={16}
            className={isFull ? 'text-yellow-500 fill-current' : 'text-gray-300'}
          />
          {isHalf && (
            <div className="absolute top-0 left-0 overflow-hidden" style={{ width: '50%' }}>
              <Star size={16} className="text-yellow-500 fill-current" />
            </div>
          )}
        </div>
      );
    });
  };

  const getFilteredRelatedProducts = () => {
    if (!product || !relatedProducts) return [];
    
    const productId = product.id ?? product._id;
    // Handle both category (from products list) and categorySlug (from individual product)
    const currentProductCategory = product.category || product.categorySlug;
    
    // First, try to get products from the same category
    const sameCategory = relatedProducts
      .filter((p) => {
        const relatedProductId = p.id ?? p._id;
        const isNotSameProduct = relatedProductId !== productId;
        const isSameCategory = p.category === currentProductCategory;
        
        return isNotSameProduct && isSameCategory;
      });
    
    // If we have enough from the same category, return those
    if (sameCategory.length >= 4) {
      return sameCategory.slice(0, 4);
    }
    
    // Otherwise, add products from related categories to fill up to 4 items
    const otherProducts = relatedProducts
      .filter((p) => {
        const relatedProductId = p.id ?? p._id;
        const isNotSameProduct = relatedProductId !== productId;
        const isNotAlreadyIncluded = !sameCategory.find(sp => (sp.id ?? sp._id) === relatedProductId);
        
        return isNotSameProduct && isNotAlreadyIncluded;
      })
      .slice(0, 4 - sameCategory.length);
    
    return [...sameCategory, ...otherProducts];
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
            {/* Main Image */}
            <div 
              className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden cursor-zoom-in"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleImageMouseMove}
              data-testid="product-image-main"
            >
              {(() => {
                const allImages = [product.image, ...((product as any).images || [])].filter(Boolean);
                const currentImage = allImages[selectedImage] || product.image;
                return (
                  <img
                    src={currentImage}
                    alt={`${product.name} - Image ${selectedImage + 1}`}
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
                );
              })()}
              
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

            {/* Thumbnail Images Gallery */}
            {(() => {
              const allImages = [product.image, ...((product as any).images || [])].filter(Boolean);
              if (allImages.length > 1) {
                return (
                  <div className="grid grid-cols-4 gap-2">
                    {allImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={cn(
                          "relative aspect-square bg-gray-50 rounded-lg overflow-hidden border-2 transition-all hover:border-green-500",
                          selectedImage === index ? "border-green-500 ring-2 ring-green-500 ring-offset-2" : "border-gray-200"
                        )}
                        data-testid={`thumbnail-${index}`}
                      >
                        <img
                          src={img}
                          alt={`${product.name} thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                );
              }
              return null;
            })()}
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
                  {renderStars(product.rating || 0, product.reviews || 0)}
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
                <div className="mb-2">
                  <span className={cn(
                    "text-sm font-medium",
                    isOutOfStock ? "text-red-600" : "text-green-600"
                  )}>
                    {isOutOfStock ? "Out of Stock" : "In Stock"}
                  </span>
                </div>
                {/* Stock Number Display - Always show below "In Stock" */}
                {product.stockQuantity !== undefined && product.stockQuantity !== null && (
                  <div className="mb-2">
                    <span className="text-base font-semibold text-gray-900" data-testid="stock-number">
                      Stock: {product.stockQuantity}
                    </span>
                  </div>
                )}
              </div>

              {/* Product Specifications/Info */}
              {product.description && (
                <div className="mb-6 prose prose-sm max-w-none text-gray-600">
                  <p>{product.description}</p>
                </div>
              )}

              {/* Color Variations */}
              {product.availableColors && product.availableColors.length > 0 && (
                <div className="mb-6">
                  <span className="text-sm font-medium text-gray-900 block mb-3">Available Colors:</span>
                  <div className="flex flex-wrap gap-2">
                    {product.availableColors.map((colorVal, index) => {
                      const [name, hex] = colorVal.includes(':') ? colorVal.split(':') : [colorVal, colorVal];
                      const isSelected = selectedColor === colorVal;
                      return (
                        <button 
                          key={index}
                          onClick={() => setSelectedColor(colorVal)}
                          className={cn(
                            "flex items-center gap-2 px-3 py-1.5 bg-gray-50 border rounded-md transition-all hover:border-[#26732d]",
                            isSelected ? "border-[#26732d] ring-1 ring-[#26732d] bg-[#26732d]/5" : "border-gray-200"
                          )}
                          title={name}
                        >
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300" 
                            style={{ backgroundColor: hex }}
                          />
                          <span className="text-sm text-gray-700 capitalize">{name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Weight Variations */}
              {product.availableWeights && product.availableWeights.length > 0 && (
                <div className="mb-6">
                  <span className="text-sm font-medium text-gray-900 block mb-3">Available Weights:</span>
                  <div className="flex flex-wrap gap-2">
                    {product.availableWeights.map((weight, index) => {
                      const isSelected = selectedWeight === weight;
                      return (
                        <button
                          key={index} 
                          onClick={() => setSelectedWeight(weight)}
                          className={cn(
                            "px-3 py-1 text-sm font-normal border rounded-md transition-all hover:border-[#26732d]",
                            isSelected ? "border-[#26732d] ring-1 ring-[#26732d] bg-[#26732d]/5 text-[#26732d]" : "border-gray-300 bg-white text-gray-700"
                          )}
                        >
                          {weight}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium text-gray-900">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    data-testid="quantity-decrease"
                    className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 border-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center text-gray-900 bg-white border-x border-gray-200" data-testid="quantity-display">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.stockQuantity || 100, quantity + 1))}
                    disabled={quantity >= (product.stockQuantity || 100)}
                    data-testid="quantity-increase"
                    className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 border-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                {product.stockQuantity && quantity >= product.stockQuantity && (
                  <span className="text-sm text-orange-600 font-medium">
                    Maximum available: {product.stockQuantity}
                  </span>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={cn(
                  "w-full py-3 text-lg font-medium transition-colors",
                  isOutOfStock
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300"
                    : "bg-green-600 hover:bg-green-700 text-white border-green-600"
                )}
                data-testid="add-to-cart-button"
              >
                <ShoppingCart className="mr-2" size={20} />
                {isOutOfStock ? "Out of Stock" : isInCart ? "Add More" : "Add to Cart"}
              </Button>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 py-2 text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-gray-900 bg-white" 
                  data-testid="add-to-wishlist"
                >
                  <Heart size={16} className="mr-2" />
                  Add to Wishlist
                </Button>
                <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="flex-1 py-2 text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-gray-900 bg-white" 
                      data-testid="share-product"
                    >
                      <Share size={16} className="mr-2" />
                      Share
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Share Product</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {/* Product Link */}
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">Product Link:</p>
                        <p className="text-sm text-gray-900 break-all">
                          {typeof window !== 'undefined' ? `${window.location.origin}/product/${slug}` : ''}
                        </p>
                      </div>
                      
                      {/* Social Media Options */}
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          onClick={() => handleShare('facebook')}
                          className="flex items-center justify-center gap-2 py-3"
                        >
                          <Facebook size={20} className="text-blue-600" />
                          Facebook
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleShare('twitter')}
                          className="flex items-center justify-center gap-2 py-3"
                        >
                          <Twitter size={20} className="text-blue-400" />
                          X (Twitter)
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleShare('instagram')}
                          className="flex items-center justify-center gap-2 py-3"
                        >
                          <Instagram size={20} className="text-pink-600" />
                          Instagram
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleShare('pinterest')}
                          className="flex items-center justify-center gap-2 py-3"
                        >
                          <Send size={20} className="text-red-600" />
                          Pinterest
                        </Button>
                      </div>
                      
                      {/* Copy Link Button */}
                      <Button
                        onClick={() => handleShare('copy')}
                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Copy size={16} className="mr-2" />
                        Copy Link
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
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
                <div className="space-y-6">
                  {product.description && (
                    <div>
                      <h3 className="font-semibold mb-2 text-lg">Product Description</h3>
                      <p className="text-gray-700">{product.description}</p>
                    </div>
                  )}
                  
                  {product.weight && (
                    <div>
                      <h3 className="font-semibold mb-2 text-lg">Weight</h3>
                      <p className="text-gray-700">{product.weight}</p>
                    </div>
                  )}
                  
                  {product.ingredients && product.ingredients.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2 text-lg">Ingredients</h3>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {product.ingredients.map((ingredient: string, index: number) => (
                          <li key={index}>{ingredient}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {product.features && product.features.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2 text-lg">Features</h3>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {product.features.map((feature: string, index: number) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Shipping Information */}
                  <div className="border-t pt-6 mt-6">
                    <h3 className="font-bold mb-4 text-lg text-[#26732d] flex items-center gap-2">
                      <Truck className="w-5 h-5" />
                      Delivery Information
                    </h3>
                    <div className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-lg p-5">
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
                          <div className="flex items-start gap-3">
                            <div className="bg-blue-100 rounded-full p-2">
                              <MapPin className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-blue-900 mb-1">Inside Dhaka</h4>
                              <p className="text-2xl font-bold text-blue-600">৳80</p>
                              <p className="text-sm text-blue-700 mt-1">Up to 2kg</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-green-100">
                          <div className="flex items-start gap-3">
                            <div className="bg-green-100 rounded-full p-2">
                              <MapPin className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-green-900 mb-1">Outside Dhaka</h4>
                              <p className="text-2xl font-bold text-green-600">৳130</p>
                              <p className="text-sm text-green-700 mt-1">Up to 1kg</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-orange-50 border border-orange-300 rounded-lg p-3">
                        <p className="text-sm font-semibold text-orange-900 mb-1">Additional Weight:</p>
                        <p className="text-sm text-orange-800">
                          <strong>৳20 per kg</strong> will be added for extra weight beyond base limits
                        </p>
                      </div>
                      
                      
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Existing Reviews */}
                  <div>
                    <h3 className="font-semibold mb-4">Customer Reviews ({reviews.length})</h3>
                    {reviews.length === 0 ? (
                      <div className="text-center py-8 border-b">
                        <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
                      </div>
                    ) : (
                      <div className="space-y-4 border-b pb-6 mb-6">
                        {reviews.map((review: any) => (
                          <div key={review._id} className="border-b last:border-b-0 pb-4 last:pb-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h5 className="font-semibold">{review.userName}</h5>
                                  {review.isVerifiedPurchase && (
                                    <Badge className="bg-green-500 text-white text-xs">Verified Purchase</Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex">
                                    {Array.from({ length: 5 }, (_, index) => (
                                      <Star
                                        key={index}
                                        size={16}
                                        className={index < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-500">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add Review Form */}
                  <div>
                    <h4 className="font-semibold mb-4">Write a Review</h4>
                    <div className="space-y-4">
                      {/* User Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Name *
                        </label>
                        <Input
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          placeholder="Enter your name"
                          className="w-full"
                        />
                      </div>

                      {/* User Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Email (Optional)
                        </label>
                        <Input
                          type="email"
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="w-full"
                        />
                      </div>

                      {/* Rating */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rating
                        </label>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }, (_, index) => (
                            <button
                              key={index}
                              onClick={() => setUserRating(index + 1)}
                              className="p-1"
                            >
                              <Star
                                size={24}
                                className={index < userRating 
                                  ? 'text-yellow-500 fill-current cursor-pointer' 
                                  : 'text-gray-300 cursor-pointer hover:text-yellow-400'
                                }
                              />
                            </button>
                          ))}
                          <span className="ml-2 text-sm text-gray-600">
                            {userRating > 0 ? `${userRating} star${userRating > 1 ? 's' : ''}` : 'Select a rating'}
                          </span>
                        </div>
                      </div>

                      {/* Review Text */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Review
                        </label>
                        <Textarea
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          placeholder="Share your experience with this product..."
                          className="w-full min-h-[100px]"
                          rows={4}
                        />
                      </div>

                      {/* Submit Button */}
                      <Button
                        onClick={handleSubmitReview}
                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white"
                      >
                        Submit Review
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recommended Products */}
        {getFilteredRelatedProducts().length > 0 && (
          <div className="border-t pt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Recommended Products</h2>
            <div className="flex overflow-x-auto space-x-4 pb-4 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 sm:space-x-0">
              {getFilteredRelatedProducts().map((relatedProduct) => (
                <div key={relatedProduct.id ?? relatedProduct._id} className="flex-shrink-0">
                  <ProductCard
                    product={relatedProduct}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}