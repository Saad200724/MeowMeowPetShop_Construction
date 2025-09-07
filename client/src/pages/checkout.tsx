
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/contexts/cart-context';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { ChevronDown, ChevronUp, CreditCard, Truck } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';

interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  username: string;
  password: string;
  createAccount: boolean;
}

interface BillingDetails {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  area: string;
  zipCode: string;
}

export default function CheckoutPage() {
  const { state: cartState, clearCart } = useCart();
  const { user, signIn } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  // Form states
  const [showLogin, setShowLogin] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '', remember: false });
  const [couponCode, setCouponCode] = useState('');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
    username: '',
    password: '',
    createAccount: false
  });
  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    area: '',
    zipCode: ''
  });
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartState.items.length === 0) {
      setLocation('/');
    }
  }, [cartState.items.length, setLocation]);

  // Pre-fill form if user is logged in
  useEffect(() => {
    if (user) {
      setCustomerInfo(prev => ({
        ...prev,
        email: user.email || '',
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim()
      }));
      setBillingDetails(prev => ({
        ...prev,
        email: user.email || '',
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim()
      }));
    }
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login functionality
    toast({
      title: "Login functionality coming soon",
      description: "Please proceed as guest for now.",
      variant: "default",
    });
    setShowLogin(false);
  };

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create order');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      clearCart();
      toast({
        title: "Order placed successfully!",
        description: `Order #${data.invoice.invoiceNumber} has been created.`,
      });
      setLocation(`/invoice/${data.invoice._id}`);
    },
    onError: (error) => {
      toast({
        title: "Order failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!billingDetails.name || !billingDetails.phone || !billingDetails.email) {
      toast({
        title: "Missing information",
        description: "Please fill in all required billing details.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    const orderData = {
      userId: user?.id || 'guest',
      customerInfo: {
        name: billingDetails.name,
        email: billingDetails.email,
        phone: billingDetails.phone,
        address: {
          address: billingDetails.address,
          city: billingDetails.city,
          area: billingDetails.area,
          zipCode: billingDetails.zipCode
        }
      },
      items: cartState.items.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      subtotal: cartState.total,
      total: cartState.total,
      paymentMethod,
      shippingAddress: billingDetails,
      orderNotes
    };

    try {
      await createOrderMutation.mutateAsync(orderData);
    } catch (error) {
      console.error('Order creation failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartState.items.length === 0) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-[#26732d] mb-8">Checkout</h1>
          
          <div className="grid lg:grid-cols-3 gap-1">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Login Section */}
              {!user && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Returning customer?</CardTitle>
                      <Button 
                        variant="link" 
                        onClick={() => setShowLogin(!showLogin)}
                        className="text-[#26732d] hover:text-[#1e5d26]"
                      >
                        Click here to login
                        {showLogin ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                      </Button>
                    </div>
                  </CardHeader>
                  
                  {showLogin && (
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        Welcome back! Sign in to your account.
                      </p>
                      <p className="text-sm text-gray-500 mb-6">
                        If you have shopped with us before, please enter your details below. If you are a new customer, please proceed to the Billing section.
                      </p>
                      
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                          <Label htmlFor="email">Username or email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={loginData.email}
                            onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                            required
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="password">Password *</Label>
                          <Input
                            id="password"
                            type="password"
                            value={loginData.password}
                            onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                            required
                            className="mt-1"
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="remember"
                            checked={loginData.remember}
                            onCheckedChange={(checked) => setLoginData(prev => ({ ...prev, remember: checked as boolean }))}
                          />
                          <Label htmlFor="remember" className="text-sm">Remember me</Label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Button type="submit" className="bg-[#26732d] hover:bg-[#1e5d26]">
                            Sign In
                          </Button>
                          <Button variant="link" className="text-[#26732d] hover:text-[#1e5d26]">
                            Lost your password?
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  )}
                </Card>
              )}

              {/* Coupon Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Have a coupon?</CardTitle>
                    <Button 
                      variant="link" 
                      onClick={() => setShowCoupon(!showCoupon)}
                      className="text-[#26732d] hover:text-[#1e5d26]"
                    >
                      Click here to enter your code
                      {showCoupon ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                    </Button>
                  </div>
                </CardHeader>
                
                {showCoupon && (
                  <CardContent>
                    <div className="flex gap-1">
                      <Input
                        placeholder="Coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button className="bg-[#26732d] hover:bg-[#1e5d26]">
                        Apply Coupon
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Billing Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Billing details</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePlaceOrder} className="space-y-4">
                    <div>
                      <Label htmlFor="billing-name">Name *</Label>
                      <Input
                        id="billing-name"
                        value={billingDetails.name}
                        onChange={(e) => setBillingDetails(prev => ({ ...prev, name: e.target.value }))}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="billing-phone">Phone *</Label>
                      <Input
                        id="billing-phone"
                        type="tel"
                        value={billingDetails.phone}
                        onChange={(e) => setBillingDetails(prev => ({ ...prev, phone: e.target.value }))}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="billing-email">Email address *</Label>
                      <Input
                        id="billing-email"
                        type="email"
                        value={billingDetails.email}
                        onChange={(e) => setBillingDetails(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="billing-address">Address</Label>
                      <Input
                        id="billing-address"
                        value={billingDetails.address}
                        onChange={(e) => setBillingDetails(prev => ({ ...prev, address: e.target.value }))}
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-1">
                      <div>
                        <Label htmlFor="billing-city">City</Label>
                        <Input
                          id="billing-city"
                          value={billingDetails.city}
                          onChange={(e) => setBillingDetails(prev => ({ ...prev, city: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="billing-area">Area</Label>
                        <Input
                          id="billing-area"
                          value={billingDetails.area}
                          onChange={(e) => setBillingDetails(prev => ({ ...prev, area: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    {!user && (
                      <>
                        <div>
                          <Label htmlFor="account-username">Account username *</Label>
                          <Input
                            id="account-username"
                            value={customerInfo.username}
                            onChange={(e) => setCustomerInfo(prev => ({ ...prev, username: e.target.value }))}
                            required={customerInfo.createAccount}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="account-password">Create account password *</Label>
                          <Input
                            id="account-password"
                            type="password"
                            value={customerInfo.password}
                            onChange={(e) => setCustomerInfo(prev => ({ ...prev, password: e.target.value }))}
                            required={customerInfo.createAccount}
                            className="mt-1"
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="create-account"
                            checked={customerInfo.createAccount}
                            onCheckedChange={(checked) => setCustomerInfo(prev => ({ ...prev, createAccount: checked as boolean }))}
                          />
                          <Label htmlFor="create-account" className="text-sm">Create an account</Label>
                        </div>
                      </>
                    )}
                  </form>
                </CardContent>
              </Card>

              {/* Additional Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Additional information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="order-notes">Order notes (optional)</Label>
                    <Textarea
                      id="order-notes"
                      placeholder="Notes about your order, e.g. special notes for delivery."
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Your order</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between font-semibold border-b pb-2">
                    <span>Product</span>
                    <span>Subtotal</span>
                  </div>

                  {cartState.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex-1">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-500 ml-2">× {item.quantity}</span>
                      </div>
                      <span className="font-medium">৳ {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}

                  <Separator />

                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>৳ {cartState.total.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>৳ {cartState.total.toLocaleString()}</span>
                  </div>

                  <Separator />

                  {/* Payment Methods */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">Payment</h4>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="Bkash" id="bkash" />
                        <Label htmlFor="bkash" className="flex items-center cursor-pointer">
                          <CreditCard className="mr-2 h-4 w-4 text-pink-600" />
                          Bkash
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="COD" id="cod" />
                        <Label htmlFor="cod" className="flex items-center cursor-pointer">
                          <Truck className="mr-2 h-4 w-4 text-green-600" />
                          Cash On Delivery (COD)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button 
                    onClick={handlePlaceOrder}
                    className="w-full bg-[#26732d] hover:bg-[#1e5d26] text-white py-3 text-lg"
                    disabled={isProcessing || cartState.items.length === 0}
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Processing Order...
                      </div>
                    ) : (
                      'Place Order'
                    )}
                  </Button>
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
