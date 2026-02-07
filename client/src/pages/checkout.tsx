
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
import { ChevronDown, ChevronUp, CreditCard, Truck, User, MapPin, MessageSquare, ShoppingBag, Tag } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';
import PaymentProcessor from '@/components/ui/payment-processor';

interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  username: string;
  password: string;
  createAccount: boolean;
}

interface BillingDetails {
  firstName: string;
  lastName: string;
  phone: string;
  alternativePhone: string;
  division: string;
  district: string;
  thanaUpazilla: string;
  postCode: string;
  address: string;
  email: string;
}

export default function CheckoutPage() {
  const { state: cartState, clearCart, applyCoupon, removeCoupon, getFinalTotal, calculateDeliveryFee: calculateWeightedDeliveryFee } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  // Form states
  const [showLogin, setShowLogin] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '', remember: false });
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isCouponLoading, setIsCouponLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
    username: '',
    password: '',
    createAccount: false
  });
  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
    firstName: '',
    lastName: '',
    phone: '',
    alternativePhone: '',
    division: '',
    district: '',
    thanaUpazilla: '',
    postCode: '',
    address: '',
    email: ''
  });
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  const calculateFinalDeliveryFee = () => {
    const district = billingDetails.district.toLowerCase();
    const location = district === 'dhaka' ? 'Inside Dhaka' : 'Outside Dhaka';
    
    // Check for free delivery coupon
    if (cartState.appliedCoupon?.code?.includes('FREE') || 
        (cartState.appliedCoupon?.discount === 0 && cartState.appliedCoupon?.code)) {
      return 0;
    }
    
    return calculateWeightedDeliveryFee(location);
  };

  const finalDeliveryFee = calculateFinalDeliveryFee();

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
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || ''
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
          orderAmount: cartState.total
        }),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        const discountAmount = data.coupon.discountType === 'free_delivery' ? 0 : data.coupon.discountAmount;
        applyCoupon({
          code: data.coupon.code,
          discount: discountAmount
        });
        setCouponCode('');
        setCouponError('');
        
        if (data.coupon.discountType === 'free_delivery') {
          toast({
            title: "Coupon applied successfully!",
            description: "Your delivery fee has been waived!",
          });
        } else {
          toast({
            title: "Coupon applied successfully!",
            description: `You saved ৳${data.coupon.discountAmount}`,
          });
        }
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
    toast({
      title: "Coupon removed",
      description: "Discount has been removed from your order.",
    });
  };

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await apiRequest('/api/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
      return response;
    },
    onSuccess: (data) => {
      if (paymentMethod === 'RupantorPay') {
        // For online payment, store invoice ID (not order ID) and show payment processor
        setCreatedOrderId(data.invoice._id);
        setShowPayment(true);
        toast({
          title: "Order created successfully!",
          description: "Please complete your payment to confirm the order.",
        });
      } else {
        // For COD and other methods, proceed as usual
        clearCart();
        toast({
          title: "Order placed successfully!",
          description: `Order #${data.invoice.invoiceNumber} has been created.`,
        });
        setLocation(`/invoice/${data.invoice._id}`);
      }
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
    
    // Comprehensive form validation
    const missingFields = [];
    if (!billingDetails.firstName.trim()) missingFields.push("First Name");
    if (!billingDetails.phone.trim()) missingFields.push("Phone Number");
    if (!billingDetails.email.trim()) missingFields.push("Email Address");
    if (!billingDetails.address.trim()) missingFields.push("Full Address");
    if (!billingDetails.division.trim()) missingFields.push("Division");
    if (!billingDetails.district.trim()) missingFields.push("District");

    if (missingFields.length > 0) {
      toast({
        title: "Missing Required Information",
        description: `Please fill in: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(billingDetails.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    // Phone validation (Bangladesh mobile number)
    const phoneRegex = /^(\+88)?01[3-9]\d{8}$/;
    if (!phoneRegex.test(billingDetails.phone.replace(/\s/g, ''))) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Bangladesh mobile number (e.g., 01XXXXXXXXX).",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    const finalTotal = getFinalTotal() + finalDeliveryFee;

    const orderData = {
      userId: user?.id || 'guest',
      total: finalTotal,
      customerInfo: {
        name: `${billingDetails.firstName} ${billingDetails.lastName}`.trim(),
        email: billingDetails.email,
        phone: billingDetails.phone,
        alternativePhone: billingDetails.alternativePhone,
        address: {
          address: billingDetails.address,
          division: billingDetails.division,
          district: billingDetails.district,
          thanaUpazilla: billingDetails.thanaUpazilla,
          postCode: billingDetails.postCode
        }
      },
      items: cartState.items.map(item => ({
        productId: item.productId || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        weight: item.weight,
        color: item.color
      })),
      discountCode: cartState.appliedCoupon ? cartState.appliedCoupon.code : null,
      paymentMethod,
      shippingAddress: {
        address: billingDetails.address,
        division: billingDetails.division,
        district: billingDetails.district,
        thanaUpazilla: billingDetails.thanaUpazilla,
        postCode: billingDetails.postCode
      },
      deliveryFee: finalDeliveryFee,
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

  const handlePaymentSuccess = (transactionId: string) => {
    clearCart();
    setShowPayment(false);
    toast({
      title: "Payment successful!",
      description: `Payment completed successfully. Transaction ID: ${transactionId}`,
    });
    setLocation(`/invoice/${createdOrderId}`); // createdOrderId now stores invoice._id
  };

  const handlePaymentError = (error: string) => {
    setShowPayment(false);
    toast({
      title: "Payment failed",
      description: error,
      variant: "destructive",
    });
  };

  if (cartState.items.length === 0) {
    return null; // Will redirect via useEffect
  }

  // Show payment processor if payment is required
  if (showPayment && createdOrderId) {
    const finalTotal = getFinalTotal();
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="py-8">
          <div className="max-w-2xl mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#26732d]">Complete Payment</h1>
              <p className="text-gray-600 mt-2">
                Your order has been created. Please complete the payment to confirm.
              </p>
            </div>
            
            <PaymentProcessor
              orderId={createdOrderId}
              amount={finalTotal}
              customerInfo={{
                fullname: `${billingDetails.firstName} ${billingDetails.lastName}`.trim(),
                email: billingDetails.email,
                phone: billingDetails.phone,
              }}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              metadata={{
                orderType: 'ecommerce',
                items: cartState.items.length,
                coupon: cartState.appliedCoupon?.code || null,
              }}
            />
            
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPayment(false);
                  setCreatedOrderId(null);
                }}
                className="text-gray-600 hover:text-gray-800"
              >
                ← Back to Checkout
              </Button>
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
      
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header with logo and phone - Mobile Optimized */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-4 sm:mb-8">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 sm:gap-4">
                <img src="/logo.png" alt="Meow Meow Pet Shop" className="w-10 h-10 sm:w-12 sm:h-12" />
                <div>
                  <h1 className="text-xl sm:text-3xl font-bold text-[#26732d]">Checkout</h1>
                  <p className="text-xs sm:text-base text-gray-600 hidden sm:block">Complete your order</p>
                </div>
              </div>
              <a href="tel:+8801405045023" className="flex flex-col items-end">
                <p className="text-sm sm:text-lg font-semibold text-[#26732d]">📞 01405-045023</p>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Customer Support</p>
              </a>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Login Section - Mobile Optimized */}
              {!user && (
                <Card className="border-[#ffde59] border-2">
                  <CardHeader className="bg-[#ffde59]/10 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-[#26732d] flex-shrink-0" />
                        <CardTitle className="text-base sm:text-lg text-[#26732d]">Already have an account?</CardTitle>
                      </div>
                      <Button 
                        variant="link" 
                        onClick={() => setShowLogin(!showLogin)}
                        className="text-[#26732d] hover:text-[#1e5d26] font-medium text-sm sm:text-base p-0 h-auto justify-start sm:justify-center"
                      >
                        Click here to login
                        {showLogin ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                      </Button>
                    </div>
                  </CardHeader>
                  
                  {showLogin && (
                    <CardContent className="pt-6">
                      <p className="text-gray-600 mb-4">
                        Welcome back! Sign in to your account.
                      </p>
                      
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                          <Label htmlFor="email" className="text-[#26732d] font-medium">Username or email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={loginData.email}
                            onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                            required
                            className="mt-1 border-gray-300 focus:border-[#26732d] focus:ring-[#26732d]"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="password" className="text-[#26732d] font-medium">Password *</Label>
                          <Input
                            id="password"
                            type="password"
                            value={loginData.password}
                            onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                            required
                            className="mt-1 border-gray-300 focus:border-[#26732d] focus:ring-[#26732d]"
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="remember"
                            checked={loginData.remember}
                            onCheckedChange={(checked) => setLoginData(prev => ({ ...prev, remember: checked as boolean }))}
                            className="border-[#26732d] data-[state=checked]:bg-[#26732d]"
                          />
                          <Label htmlFor="remember" className="text-sm text-gray-600">Remember me</Label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Button type="submit" className="bg-[#ffde59] hover:bg-[#e6c950] text-black font-medium">
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

              

              {/* Customer Information - Mobile Optimized */}
              <Card className="border-[#26732d]/30">
                <CardHeader className="bg-[#26732d]/5 p-4 sm:p-6">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-[#26732d]" />
                    <CardTitle className="text-lg sm:text-xl text-[#26732d]">Customer Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:pt-6 sm:px-6">
                  <form className="space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <Label htmlFor="customer-first-name" className="text-[#26732d] font-medium text-sm sm:text-base mb-1.5 block">First Name *</Label>
                        <Input
                          id="customer-first-name"
                          value={billingDetails.firstName}
                          onChange={(e) => setBillingDetails(prev => ({ ...prev, firstName: e.target.value }))}
                          placeholder="Enter your first name"
                          required
                          className="h-11 sm:h-10 border-gray-300 focus:border-[#26732d] focus:ring-[#26732d] text-base"
                          data-testid="input-first-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="customer-last-name" className="text-[#26732d] font-medium text-sm sm:text-base mb-1.5 block">Last Name</Label>
                        <Input
                          id="customer-last-name"
                          value={billingDetails.lastName}
                          onChange={(e) => setBillingDetails(prev => ({ ...prev, lastName: e.target.value }))}
                          placeholder="Enter your last name"
                          className="h-11 sm:h-10 border-gray-300 focus:border-[#26732d] focus:ring-[#26732d] text-base"
                          data-testid="input-last-name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <Label htmlFor="customer-phone" className="text-[#26732d] font-medium text-sm sm:text-base mb-1.5 block">Phone *</Label>
                        <Input
                          id="customer-phone"
                          type="tel"
                          value={billingDetails.phone}
                          onChange={(e) => setBillingDetails(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="Ex: 01XXXXXXXX"
                          required
                          className="h-11 sm:h-10 border-gray-300 focus:border-[#26732d] focus:ring-[#26732d] text-base"
                          data-testid="input-phone"
                        />
                      </div>
                      <div>
                        <Label htmlFor="customer-alt-phone" className="text-[#26732d] font-medium text-sm sm:text-base mb-1.5 block">Alternative Phone</Label>
                        <Input
                          id="customer-alt-phone"
                          type="tel"
                          value={billingDetails.alternativePhone}
                          onChange={(e) => setBillingDetails(prev => ({ ...prev, alternativePhone: e.target.value }))}
                          placeholder="Ex: 01XXXXXXXX"
                          className="h-11 sm:h-10 border-gray-300 focus:border-[#26732d] focus:ring-[#26732d] text-base"
                          data-testid="input-alternative-phone"
                        />
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Select Location - Mobile Optimized */}
              <Card className="border-[#26732d]/30">
                <CardHeader className="bg-[#26732d]/5 p-4 sm:p-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[#26732d]" />
                    <CardTitle className="text-lg sm:text-xl text-[#26732d]">Select Location</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:pt-6 sm:px-6">
                  <form className="space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <Label htmlFor="billing-division" className="text-[#26732d] font-medium text-sm sm:text-base mb-1.5 block">Division *</Label>
                        <select 
                          className="w-full h-11 sm:h-auto p-3 border border-gray-300 rounded-md focus:border-[#26732d] focus:ring-[#26732d] bg-white text-base"
                          value={billingDetails.division}
                          onChange={(e) => setBillingDetails(prev => ({ ...prev, division: e.target.value }))}
                          data-testid="select-division"
                        >
                          <option value="">Select Division</option>
                          <option value="dhaka">Dhaka</option>
                          <option value="chittagong">Chittagong</option>
                          <option value="sylhet">Sylhet</option>
                          <option value="rajshahi">Rajshahi</option>
                          <option value="khulna">Khulna</option>
                          <option value="barisal">Barisal</option>
                          <option value="rangpur">Rangpur</option>
                          <option value="mymensingh">Mymensingh</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="billing-district" className="text-[#26732d] font-medium text-sm sm:text-base mb-1.5 block">District *</Label>
                        <select 
                          className="w-full h-11 sm:h-auto p-3 border border-gray-300 rounded-md focus:border-[#26732d] focus:ring-[#26732d] bg-white text-base"
                          value={billingDetails.district}
                          onChange={(e) => setBillingDetails(prev => ({ ...prev, district: e.target.value }))}
                          data-testid="select-district"
                        >
                          <option value="">Select District</option>
                          <option value="bagerhat">Bagerhat</option>
                          <option value="bandarban">Bandarban</option>
                          <option value="barguna">Barguna</option>
                          <option value="barisal">Barisal</option>
                          <option value="bhola">Bhola</option>
                          <option value="bogura">Bogura</option>
                          <option value="brahmanbaria">Brahmanbaria</option>
                          <option value="chandpur">Chandpur</option>
                          <option value="chapainawabganj">Chapainawabganj</option>
                          <option value="chattogram">Chattogram</option>
                          <option value="chuadanga">Chuadanga</option>
                          <option value="cumilla">Cumilla</option>
                          <option value="coxs-bazar">Cox's Bazar</option>
                          <option value="dhaka">Dhaka</option>
                          <option value="dinajpur">Dinajpur</option>
                          <option value="faridpur">Faridpur</option>
                          <option value="feni">Feni</option>
                          <option value="gaibandha">Gaibandha</option>
                          <option value="gazipur">Gazipur</option>
                          <option value="gopalganj">Gopalganj</option>
                          <option value="habiganj">Habiganj</option>
                          <option value="jamalpur">Jamalpur</option>
                          <option value="jashore">Jashore</option>
                          <option value="jhalokati">Jhalokati</option>
                          <option value="jhenaidah">Jhenaidah</option>
                          <option value="joypurhat">Joypurhat</option>
                          <option value="khagrachhari">Khagrachhari</option>
                          <option value="khulna">Khulna</option>
                          <option value="kishoreganj">Kishoreganj</option>
                          <option value="kurigram">Kurigram</option>
                          <option value="kushtia">Kushtia</option>
                          <option value="lakshmipur">Lakshmipur</option>
                          <option value="lalmonirhat">Lalmonirhat</option>
                          <option value="madaripur">Madaripur</option>
                          <option value="magura">Magura</option>
                          <option value="manikganj">Manikganj</option>
                          <option value="meherpur">Meherpur</option>
                          <option value="moulvibazar">Moulvibazar</option>
                          <option value="munshiganj">Munshiganj</option>
                          <option value="mymensingh">Mymensingh</option>
                          <option value="naogaon">Naogaon</option>
                          <option value="narail">Narail</option>
                          <option value="narayanganj">Narayanganj</option>
                          <option value="narsingdi">Narsingdi</option>
                          <option value="natore">Natore</option>
                          <option value="netrokona">Netrokona</option>
                          <option value="nilphamari">Nilphamari</option>
                          <option value="noakhali">Noakhali</option>
                          <option value="pabna">Pabna</option>
                          <option value="panchagarh">Panchagarh</option>
                          <option value="patuakhali">Patuakhali</option>
                          <option value="pirojpur">Pirojpur</option>
                          <option value="rajbari">Rajbari</option>
                          <option value="rajshahi">Rajshahi</option>
                          <option value="rangamati">Rangamati</option>
                          <option value="rangpur">Rangpur</option>
                          <option value="satkhira">Satkhira</option>
                          <option value="shariatpur">Shariatpur</option>
                          <option value="sherpur">Sherpur</option>
                          <option value="sirajganj">Sirajganj</option>
                          <option value="sunamganj">Sunamganj</option>
                          <option value="sylhet">Sylhet</option>
                          <option value="tangail">Tangail</option>
                          <option value="thakurgaon">Thakurgaon</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <Label htmlFor="billing-thana" className="text-[#26732d] font-medium text-sm sm:text-base mb-1.5 block">Thana/Upazilla</Label>
                        <Input
                          id="billing-thana"
                          value={billingDetails.thanaUpazilla}
                          onChange={(e) => setBillingDetails(prev => ({ ...prev, thanaUpazilla: e.target.value }))}
                          placeholder="Enter your thana/upazilla"
                          className="h-11 sm:h-10 border-gray-300 focus:border-[#26732d] focus:ring-[#26732d] text-base"
                          data-testid="input-thana"
                        />
                      </div>
                      <div>
                        <Label htmlFor="billing-postcode" className="text-[#26732d] font-medium text-sm sm:text-base mb-1.5 block">Post Code</Label>
                        <Input
                          id="billing-postcode"
                          value={billingDetails.postCode}
                          onChange={(e) => setBillingDetails(prev => ({ ...prev, postCode: e.target.value }))}
                          placeholder="Enter post code"
                          className="h-11 sm:h-10 border-gray-300 focus:border-[#26732d] focus:ring-[#26732d] text-base"
                          data-testid="input-postcode"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="billing-address" className="text-[#26732d] font-medium text-sm sm:text-base mb-1.5 block">Full Address *</Label>
                      <Textarea
                        id="billing-address"
                        value={billingDetails.address}
                        onChange={(e) => setBillingDetails(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Your full address"
                        className="border-gray-300 focus:border-[#26732d] focus:ring-[#26732d] text-base min-h-[88px]"
                        rows={3}
                        data-testid="input-address"
                      />
                    </div>

                    <div>
                      <Label htmlFor="billing-email" className="text-[#26732d] font-medium text-sm sm:text-base mb-1.5 block">Email *</Label>
                      <Input
                        id="billing-email"
                        type="email"
                        value={billingDetails.email}
                        onChange={(e) => setBillingDetails(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="your.email@example.com"
                        required
                        className="h-11 sm:h-10 border-gray-300 focus:border-[#26732d] focus:ring-[#26732d] text-base"
                        data-testid="input-email"
                      />
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Order Notes - Mobile Optimized */}
              <Card className="border-[#26732d]/30">
                <CardHeader className="bg-[#26732d]/5 p-4 sm:p-6">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-[#26732d]" />
                    <CardTitle className="text-lg sm:text-xl text-[#26732d]">Order Notes</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:pt-6 sm:px-6">
                  <Textarea
                    placeholder="Notes about your order, e.g. special notes for delivery."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="border-gray-300 focus:border-[#26732d] focus:ring-[#26732d] text-base min-h-[100px]"
                    rows={4}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary - Mobile Optimized */}
            <div className="space-y-4 sm:space-y-6">
              <Card className="border-[#26732d]/30 lg:sticky lg:top-4">
                <CardHeader className="bg-[#26732d]/5 p-4 sm:p-6">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-[#26732d]" />
                    <CardTitle className="text-lg sm:text-xl text-[#26732d]">Order Overview</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:pt-6 sm:px-6 space-y-3 sm:space-y-4">
                  <div className="flex justify-between font-semibold border-b pb-3 text-[#26732d]">
                    <span>Product</span>
                    <span>Total</span>
                  </div>

                  {cartState.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div className="flex-1">
                        <span className="font-medium text-gray-800 text-sm">{item.name}</span>
                        <span className="text-gray-500 ml-2">× {item.quantity}</span>
                      </div>
                      <span className="font-medium text-[#26732d]">৳ {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}

                  <Separator />

                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">SubTotal</span>
                    <span className="font-medium">৳ {cartState.total.toLocaleString()}</span>
                  </div>

                  <div className="space-y-2 py-2 border-b border-gray-100">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Charge</span>
                      <span className={`font-medium ${deliveryFee > 0 ? 'text-[#26732d]' : 'text-gray-400'}`}>
                        ৳ {deliveryFee.toLocaleString()}
                      </span>
                    </div>
                    <div className={`rounded-lg p-3 ${billingDetails.district && weight ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'}`}>
                      <p className={`text-xs font-semibold mb-2 ${billingDetails.district && weight ? 'text-blue-900' : 'text-gray-700'}`}>
                        Shipping Details:
                      </p>
                      <div className="space-y-1 text-xs text-gray-700">
                        {billingDetails.district ? (
                          <>
                            <p className="font-medium">
                              {billingDetails.district === 'dhaka' ? '✓ Inside Dhaka' : '✓ Outside Dhaka'}
                            </p>
                            {billingDetails.district === 'dhaka' ? (
                              <>
                                <p>• Base: ৳80 (up to 2kg)</p>
                                {weight && parseFloat(weight) > 2 && (
                                  <p>• Extra: ৳{((Math.ceil(parseFloat(weight) - 2)) * 20)} for {(parseFloat(weight) - 2).toFixed(1)}kg</p>
                                )}
                              </>
                            ) : (
                              <>
                                <p>• Base: ৳130 (up to 1kg)</p>
                                {weight && parseFloat(weight) > 1 && (
                                  <p>• Extra: ৳{((Math.ceil(parseFloat(weight) - 1)) * 20)} for {(parseFloat(weight) - 1).toFixed(1)}kg</p>
                                )}
                              </>
                            )}
                            {weight && (
                              <p className="text-[10px] text-gray-600 mt-2 italic">
                                Package weight: {weight}kg
                              </p>
                            )}
                          </>
                        ) : (
                          <>
                            <p className="font-medium text-orange-600">⚠ Select a district above</p>
                            <p>• Inside Dhaka: ৳80 (up to 2kg)</p>
                            <p>• Outside Dhaka: ৳130 (up to 1kg)</p>
                            <p className="text-[10px] text-gray-600 mt-2 italic">
                              Additional ৳20/kg will be charged for extra weight
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {cartState.appliedCoupon && (
                    <div className="flex justify-between py-2">
                      <span className="text-green-600">
                        {cartState.appliedCoupon.discount === 0 ? `Free Delivery (${cartState.appliedCoupon.code})` : `Discount (${cartState.appliedCoupon.code})`}
                      </span>
                      {cartState.appliedCoupon.discount > 0 && (
                        <span className="font-medium text-green-600">-৳ {cartState.appliedCoupon.discount.toLocaleString()}</span>
                      )}
                      {cartState.appliedCoupon.discount === 0 && (
                        <span className="font-medium text-green-600">-৳ {calculatedDeliveryFee.toLocaleString()}</span>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between py-2 text-lg font-bold text-[#26732d] border-t-2 border-[#26732d]/20 pt-3">
                    <span>Grand Total</span>
                    <span>৳ {(getFinalTotal() + deliveryFee).toLocaleString()}</span>
                  </div>

                  <Separator />

                  {/* Coupon Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-[#26732d]">Have a coupon?</h4>
                      <Button 
                        variant="link" 
                        onClick={() => setShowCoupon(!showCoupon)}
                        className="text-[#26732d] hover:text-[#1e5d26] font-medium p-0"
                        data-testid="button-toggle-coupon"
                      >
                        {showCoupon ? 'Hide' : 'Apply coupon'}
                        {showCoupon ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
                      </Button>
                    </div>
                    
                    {showCoupon && (
                      <div className="space-y-3">
                        {!cartState.appliedCoupon ? (
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <Input
                                placeholder="Enter coupon code"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                className="flex-1 text-sm border-gray-300 focus:border-[#26732d] focus:ring-[#26732d]"
                                onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                data-testid="input-coupon-code"
                              />
                              <Button
                                onClick={handleApplyCoupon}
                                disabled={isCouponLoading || !couponCode.trim()}
                                size="sm"
                                className="bg-[#26732d] hover:bg-[#1e5d26] text-white px-4"
                                data-testid="button-apply-coupon"
                              >
                                {isCouponLoading ? 'Applying...' : 'Apply'}
                              </Button>
                            </div>
                            {couponError && (
                              <p className="text-xs text-red-500" data-testid="text-coupon-error">{couponError}</p>
                            )}
                            <p className="text-xs text-gray-500">
                              Enter your coupon code to apply discount
                            </p>
                          </div>
                        ) : (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-green-600">🏷️</span>
                                <span className="text-sm font-medium text-green-800" data-testid="text-applied-coupon">
                                  {cartState.appliedCoupon.code} Applied
                                </span>
                              </div>
                              <button
                                onClick={handleRemoveCoupon}
                                className="text-xs text-green-600 hover:text-green-800 underline"
                                data-testid="button-remove-coupon"
                              >
                                Remove
                              </button>
                            </div>
                            <p className="text-xs text-green-600 mt-1">
                              You saved ৳{cartState.appliedCoupon.discount.toLocaleString()}!
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Payment Methods - Mobile Optimized */}
                  <div className="space-y-3 sm:space-y-4">
                    <h4 className="font-semibold text-[#26732d] text-base sm:text-lg">Payment Method</h4>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-3 p-3.5 sm:p-4 border-2 border-[#ffde59] rounded-lg bg-[#ffde59]/10 min-h-[56px] sm:min-h-[60px]">
                        <RadioGroupItem value="COD" id="cod" className="border-[#26732d] text-[#26732d] w-5 h-5" />
                        <Label htmlFor="cod" className="flex items-center cursor-pointer font-medium text-[#26732d] text-sm sm:text-base flex-1">
                          <Truck className="mr-2 h-5 w-5 flex-shrink-0" />
                          Cash On Delivery
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3.5 sm:p-4 border border-gray-300 rounded-lg min-h-[56px] sm:min-h-[60px]">
                        <RadioGroupItem value="Bkash" id="bkash" className="border-[#26732d] text-[#26732d] w-5 h-5" />
                        <Label htmlFor="bkash" className="flex items-center cursor-pointer font-medium text-[#26732d] text-sm sm:text-base flex-1">
                          <img 
                            src="https://upload.wikimedia.org/wikipedia/en/thumb/6/68/BKash_logo.svg/250px-BKash_logo.svg.png" 
                            alt="Bkash" 
                            className="mr-2 h-5 w-auto flex-shrink-0"
                          />
                          Bkash
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3.5 sm:p-4 border border-blue-300 rounded-lg bg-blue-50/30 min-h-[56px] sm:min-h-[60px]">
                        <RadioGroupItem value="RupantorPay" id="rupantorpay" className="border-[#26732d] text-[#26732d] w-5 h-5 flex-shrink-0" />
                        <Label htmlFor="rupantorpay" className="flex items-center cursor-pointer font-medium text-[#26732d] flex-wrap flex-1">
                          <img 
                            src="https://rupantorpay.com/public/assets/img/logo.webp" 
                            alt="RupantorPay" 
                            className="mr-2 h-3 w-auto flex-shrink-0"
                          />
                          <span className="text-xs sm:text-sm">RupantorPay(Online Payment)</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button 
                    onClick={handlePlaceOrder}
                    className="w-full bg-[#ffde59] hover:bg-[#e6c950] text-black font-bold py-3.5 sm:py-4 text-base sm:text-lg border-2 border-[#26732d] rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 min-h-[52px] sm:min-h-auto"
                    disabled={isProcessing || cartState.items.length === 0}
                    data-testid="button-place-order"
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                        <span className="text-sm sm:text-base">Processing Order...</span>
                      </div>
                    ) : (
                      'Place Order'
                    )}
                  </Button>

                  {/* Bottom Info */}
                  <div className="mt-6 p-4 bg-[#26732d]/5 rounded-lg">
                    <h5 className="font-semibold text-[#26732d] mb-2">Meow Meow Pet Shop</h5>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>ADDRESS:</strong> Pakiza Bus Stand, Chapra Mosjid Road<br />Bank Colony, Savar, Dhaka
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Hotline:</strong> 01405-045023
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Email:</strong> meowmeowpetshop1@gmail.com
                    </p>
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
