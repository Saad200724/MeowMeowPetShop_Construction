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
import { setSEO } from '@/lib/seo';
import ProductCard from '@/components/ui/product-card';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { cn } from '@/lib/utils';
import { Product as BaseProduct } from '@/lib/product-data';

type DetailProduct = BaseProduct & {
  _id?: string;
  categorySlug?: string;
  categoryName?: string;
  brandName?: string;
  stockStatus?: string;
  stockQuantity?: number;
  weight?: string;
  ingredients?: string[];
  features?: string[];
  availableWeights?: string[];
  availableColors?: string[];
  availablePieces?: string[];
  images?: string[];
  isBestSeller?: boolean;
  isNew?: boolean;
};

export default function ProductDetailPage() {
  const { id: slug } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [userRating, setUserRating] = useState(0);
  const { addItem, updateQuantity, state } = useCart();
  const { toast } = useToast();

  const { data: product, isLoading } = useQuery<DetailProduct>({ 
    queryKey: ['/api/products/slug', slug],
    queryFn: async () => {
      const response = await fetch(`/api/products/slug/${slug}`);
      if (response.ok) return await response.json();
      
      const repackResponse = await fetch('/api/repack-products');
      if (repackResponse.ok) {
        const repackProducts = await repackResponse.json();
        const foundProduct = repackProducts.find((p: any) => 
          p.slug === slug || p._id === slug || p.id === slug ||
          p.name?.toLowerCase().replace(/\s+/g, '-') === slug?.toLowerCase()
        );
        if (foundProduct) {
          return {
            ...foundProduct,
            id: foundProduct._id || foundProduct.id,
            slug: foundProduct.slug || slug,
            categoryName: foundProduct.categoryName || foundProduct.categoryId || 'Repack Products',
            category: foundProduct.category || foundProduct.categoryId || 'Repack Products',
            tags: foundProduct.tags || ['repack']
          };
        }
      }
      throw new Error('Product not found');
    },
    enabled: !!slug,
  });

  useEffect(() => {
    if (product) {
      if (product.availableWeights?.length) setSelectedWeight(product.availableWeights[0]);
      if (product.availableColors?.length) setSelectedColor(product.availableColors[0]);
      if (product.availablePieces?.length) setSelectedPiece(product.availablePieces[0]);
    }
  }, [product]);

  const productId = product?.id ?? product?._id;

  const { data: allProducts = [] } = useQuery<DetailProduct[]>({
    queryKey: ['/api/products'],
  });

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

  const relatedProducts = allProducts.filter(p => (p.id ?? p._id) !== productId).slice(0, 8);

  useEffect(() => {
    setSelectedImage(0);
  }, [productId]);

  useEffect(() => {
    if (product) {
      setSEO({
        title: `${product.name} - ${product.brandName || 'Pet Supplies'} | Meow Meow Pet Shop`,
        description: product.description?.substring(0, 160) || `Buy ${product.name} at the best price in Bangladesh.`,
        ogImage: product.image,
      });
    }
  }, [product, slug]);

  const isInCart = state.items.some((item) => item.productId === productId);
  const isOutOfStock = product?.stockQuantity === 0 || product?.stockStatus === "Out of Stock";

  const handleAddToCart = () => {
    if (!product || isOutOfStock) return;
    const cartItemId = `${productId}-${selectedWeight || 'default'}-${selectedColor || 'default'}-${selectedPiece || 'default'}`;
    addItem({
      id: cartItemId,
      productId: productId!,
      name: product.name,
      price: product.price,
      image: product.image,
      maxStock: product.stockQuantity || 100,
      weight: selectedWeight,
      color: selectedColor,
      piece: selectedPiece,
    });
    if (quantity > 1) updateQuantity(cartItemId, quantity);
    toast({ title: "Added to Cart", description: `${quantity} x ${product.name} added.` });
  };

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({ 
      x: ((e.clientX - rect.left) / rect.width) * 100, 
      y: ((e.clientY - rect.top) / rect.height) * 100 
    });
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      toast({ title: "Link copied!" });
    } else {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    }
    setIsShareOpen(false);
  };

  const handleSubmitReview = async () => {
    if (!userName.trim() || !reviewText.trim() || userRating === 0) return;
    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, userName, rating: userRating, comment: reviewText }),
      });
      toast({ title: "Review submitted!" });
      setUserName(''); setReviewText(''); setUserRating(0);
      refetchReviews();
    } catch (e) {}
  };

  const renderStars = (rating: number, count: number) => {
    const r = count > 0 ? rating : 5;
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={16} className={r >= i + 1 ? 'text-yellow-500 fill-current' : 'text-gray-300'} />
    ));
  };

  if (isLoading) return <div className="min-h-screen animate-pulse bg-white"><Header /><div className="container mx-auto p-8"><div className="h-96 bg-gray-200 rounded-lg" /></div><Footer /></div>;
  if (!product) return <div className="min-h-screen bg-white"><Header /><div className="container mx-auto p-8 text-center">Product Not Found</div><Footer /></div>;

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const allImages = [product.image, ...(product.images || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <span>Home</span> / <span>{product.category || 'Products'}</span> / <span className="text-gray-900">{product.name}</span>
        </nav>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-4">
            <div 
              className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden cursor-zoom-in"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleImageMouseMove}
            >
              <img 
                src={allImages[selectedImage] || product.image} 
                className={cn("w-full h-full object-cover transition-transform duration-300", isZoomed && "scale-150")}
                style={isZoomed ? { transformOrigin: `${mousePosition.x}% ${mousePosition.y}%` } : {}}
              />
              {hasDiscount && <Badge className="absolute top-4 left-4 bg-red-500">-৳{product.originalPrice! - product.price}</Badge>}
            </div>
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {allImages.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)} className={cn("aspect-square border-2 rounded-lg overflow-hidden", selectedImage === i ? "border-green-600" : "border-gray-200")}>
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                {renderStars(product.rating || 0, product.reviews || 0)}
                <span className="text-sm text-gray-600">({product.reviews || 0} reviews)</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-green-600">৳{product.price}</span>
                {hasDiscount && <span className="text-xl text-gray-400 line-through">৳{product.originalPrice}</span>}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={isOutOfStock ? "destructive" : "secondary"}>{isOutOfStock ? "Out of Stock" : "In Stock"}</Badge>
                {product.stockQuantity && <span className="text-sm text-gray-500">Stock: {product.stockQuantity}</span>}
              </div>
            </div>

            {!isOutOfStock && (
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg h-10">
                  <Button variant="ghost" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}><Minus size={14}/></Button>
                  <span className="w-8 text-center text-sm font-bold">{quantity}</span>
                  <Button variant="ghost" size="sm" onClick={() => setQuantity(quantity + 1)}><Plus size={14}/></Button>
                </div>
                <Button onClick={handleAddToCart} className="flex-1 h-10 bg-green-600 hover:bg-green-700">Add to Cart</Button>
              </div>
            )}

            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg"><Truck className="w-5 h-5 text-green-600" /></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Delivery Information</h3>
                  <p className="text-xs text-gray-500">Fast & reliable shipping</p>
                </div>
              </div>
              <details className="group border rounded-lg overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 bg-white list-none">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">৳</div>
                    <span className="font-bold text-gray-900">Delivery Charges</span>
                  </div>
                  <Plus className="w-5 h-5 text-gray-400 group-open:rotate-45 transition-transform" />
                </summary>
                <div className="p-4 pt-0 space-y-3 border-t bg-gray-50/50">
                  <div className="flex justify-between text-sm py-2 border-b border-gray-100 last:border-0">
                    <span className="text-gray-600">Inside Dhaka City</span>
                    <span className="font-bold text-gray-900">BDT 70</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b border-gray-100 last:border-0">
                    <span className="text-gray-600">Outside Dhaka City</span>
                    <span className="font-bold text-gray-900">BDT 120</span>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded text-xs text-blue-700 leading-relaxed">
                    <span className="font-semibold">Note:</span> The delivery charge might vary due to product size, quantity, and delivery location.
                  </div>
                </div>
              </details>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Service Area</p>
                  <p className="text-xs text-gray-500">Available all over Bangladesh</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="description" className="mb-12">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <Card><CardContent className="p-6">
              <div className="space-y-6">
                {product.description && <div dangerouslySetInnerHTML={{ __html: product.description }} className="prose prose-sm max-w-none text-gray-700" />}
                {product.weight && <div><h4 className="font-bold mb-1">Weight</h4><p className="text-sm text-gray-600">{product.weight}</p></div>}
                {product.features?.length && (
                  <div>
                    <h4 className="font-bold mb-1">Features</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600">{product.features.map((f, i) => <li key={i}>{f}</li>)}</ul>
                  </div>
                )}
              </div>
            </CardContent></Card>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <Card><CardContent className="p-6">
              <div className="space-y-4">
                {reviews.length ? reviews.map((r: any) => (
                  <div key={r._id} className="border-b last:border-0 pb-4">
                    <div className="font-bold">{r.userName}</div>
                    <div className="flex gap-1 my-1">{renderStars(r.rating, 1)}</div>
                    <p className="text-sm text-gray-700">{r.comment}</p>
                  </div>
                )) : <p className="text-center text-gray-500 py-8">No reviews yet.</p>}
              </div>
            </CardContent></Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
