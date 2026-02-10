import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ShoppingCart, Tag } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function CartPage() {
  const { state, updateQuantity, removeItem, clearCart, applyCoupon, removeCoupon, getFinalTotal } = useCart();
  const [isClearing, setIsClearing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isCouponLoading, setIsCouponLoading] = useState(false);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity);
    }
  };

  const handleClearCart = () => {
    setIsClearing(true);
    clearCart();
    setTimeout(() => setIsClearing(false), 500);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setIsCouponLoading(true);
    setCouponError('');

    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: couponCode.trim(),
          orderAmount: state.total
        }),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        applyCoupon({
          code: data.coupon.code,
          discount: data.coupon.discountAmount
        });
        setCouponCode('');
        setCouponError('');
      } else {
        setCouponError(data.message || 'Invalid coupon code');
      }
    } catch (error) {
      console.error('Coupon validation error:', error);
      setCouponError('Failed to validate coupon. Please try again.');
    } finally {
      setIsCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
  };

  const formatPrice = (price: number) => {
    return `৳${price.toLocaleString()}`;
  };

  const finalTotal = getFinalTotal();

  const deliveryFeeInfo = {
    inside: 80,
    outside: 130
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="pt-16 md:pt-24 pb-8">
          <div className="max-w-md mx-auto px-4">
            <div className="text-center py-16">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="h-10 w-10 text-gray-400" />
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Your Cart is Empty</h1>
              <p className="text-gray-600 mb-8 text-sm md:text-base">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link href="/products">
                <Button size="lg" className="w-full md:w-auto bg-[#26732d] hover:bg-[#1e5d26] text-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-16 md:pt-24 pb-8">
        <div className="max-w-md md:max-w-4xl mx-auto px-4">
          {/* Header Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
                Shopping Cart
              </h1>
              <Button 
                variant="outline" 
                onClick={handleClearCart}
                disabled={isClearing}
                className="text-xs md:text-sm bg-black text-white border-black hover:bg-white hover:text-black hover:border-black transition-colors"
                size="sm"
              >
                {isClearing ? 'Clearing...' : 'Clear'}
              </Button>
            </div>
            <p className="text-gray-600 text-sm md:text-base">
              {state.itemCount} {state.itemCount === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          <div className="md:grid md:grid-cols-3 md:gap-6">
            {/* Cart Items - Mobile First Design */}
            <div className="md:col-span-2 space-y-3 mb-6 md:mb-0">
              {state.items.map((item) => (
                <Card key={item.id} className="shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg border"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm md:text-base text-gray-900 line-clamp-2 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-[#26732d] font-bold text-sm md:text-base mb-3">
                          {formatPrice(item.price)}
                        </p>

                        {/* Product Description Snippet - Add Shipping Info Here */}
                        <div className="text-xs text-gray-500 mb-3 line-clamp-2">
                          <p className="mt-1 font-semibold text-gray-700">
                            Shipping: Inside Dhaka City: ৳80 (up to 2kg), Outside Dhaka City (Incl. Savar): ৳130 (up to 1kg). Additional ৳20 per kg.
                          </p>
                        </div>

                        {/* Quantity and Remove Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded-full p-1 transition-colors"
                            >
                              <Minus className="h-3 w-3 md:h-4 md:w-4" />
                            </button>

                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>

                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.maxStock}
                              className="bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded-full p-1 transition-colors"
                            >
                              <Plus className="h-3 w-3 md:h-4 md:w-4" />
                            </button>

                            {item.maxStock && (
                              <Badge variant="secondary" className="text-xs ml-2">
                                Max: {item.maxStock}
                              </Badge>
                            )}
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 rounded-full p-1.5 transition-colors"
                          >
                            <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Item Total - Right Side */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm md:text-base font-bold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary - Mobile Optimized */}
            <div className="md:col-span-1">
              <Card className="sticky top-20">
                <CardContent className="p-4 md:p-6">
                  <h2 className="text-lg font-bold mb-4">Order Summary</h2>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm md:text-base">
                      <span>Subtotal ({state.itemCount} items)</span>
                      <span className="font-medium">{formatPrice(state.total)}</span>
                    </div>

                    {/* Updated Delivery Section */}
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Delivery</span>
                      <div className="text-right">
                        <span className="font-medium text-gray-600">Calculated at checkout</span>
                        <p className="text-xs text-gray-500 mt-1">Inside Dhaka City: ৳80 (up to 2kg)</p>
                        <p className="text-xs text-gray-500">Outside Dhaka City (Incl. Savar): ৳130 (up to 1kg)</p>
                        <p className="text-xs text-gray-500 mt-1">Additional: ৳20/kg</p>
                      </div>
                    </div>

                    {state.appliedCoupon && (
                      <div className="flex justify-between text-sm md:text-base text-green-600">
                        <span>Discount ({state.appliedCoupon.code})</span>
                        <span className="font-medium">-{formatPrice(state.appliedCoupon.discount)}</span>
                      </div>
                    )}

                    <Separator />

                    <div className="flex justify-between text-base md:text-lg font-bold">
                      <span>Total</span>
                      <span className="text-[#26732d]">{formatPrice(finalTotal)}</span>
                    </div>

                    {/* Coupon Section */}
                    <div className="mt-6 pt-4 border-t">
                      <div className="flex items-center gap-2 mb-3">
                        <Tag size={16} className="text-[#26732d]" />
                        <span className="text-sm font-medium text-gray-700">Have a coupon?</span>
                      </div>

                      {!state.appliedCoupon ? (
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Enter coupon code"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value)}
                              className="flex-1 text-sm"
                              onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                            />
                            <Button
                              onClick={handleApplyCoupon}
                              disabled={isCouponLoading || !couponCode.trim()}
                              size="sm"
                              className="bg-[#26732d] hover:bg-[#1e5d26] text-white px-4"
                            >
                              {isCouponLoading ? 'Applying...' : 'Apply'}
                            </Button>
                          </div>
                          {couponError && (
                            <p className="text-xs text-red-500">{couponError}</p>
                          )}
                          <p className="text-xs text-gray-500">
                            Enter your coupon code to apply discount
                          </p>
                        </div>
                      ) : (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Tag size={14} className="text-green-600" />
                              <span className="text-sm font-medium text-green-800">
                                {state.appliedCoupon.code} Applied
                              </span>
                            </div>
                            <button
                              onClick={handleRemoveCoupon}
                              className="text-xs text-green-600 hover:text-green-800 underline"
                            >
                              Remove
                            </button>
                          </div>
                          <p className="text-xs text-green-600 mt-1">
                            You saved {formatPrice(state.appliedCoupon.discount)}!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 mt-8">
                    <Link href="/checkout">
                      <Button 
                        className="w-full bg-[#ffde59] hover:bg-[#e6c950] text-black font-medium py-3"
                        size="lg"
                        data-testid="proceed-to-checkout-button"
                      >
                        Proceed to Checkout
                      </Button>
                    </Link>

                    <Link href="/products">
                      <Button 
                        variant="outline" 
                        className="w-full border-[#26732d] text-white hover:bg-[#26732d] hover:text-white py-3 bg-[#26732d]"
                        size="lg"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}