
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

  const dhakaThanas = [
    "Adabar", "Airport", "Ati Bazar (Keraniganj)", "Azompur", "Badda", "Banani", 
    "Bangshal", "Bashundhara R/A", "Battery Section", "Bhashantek", "Cantonment", 
    "Chalkbazar", "Dakshin Khan", "Darus Salam", "Demra", "Dhanmondi", "Gendaria", 
    "Gulistan", "Hatirjheel", "Hazaribag", "Jattrabari", "Kadamtali", "Kafrul", 
    "Kalabagan", "Kamrangirchar", "Khilgaon", "Khilkhet", "Kotwali", "Lalbagh", 
    "Mirpur", "Mohammadpur", "Motijheel", "Mugda", "New Market", "Pallabi", 
    "Paltan", "Panthapath", "Purbachal", "Ramna", "Rampura", "Rupnagar", 
    "Sabujbag", "Shah Ali", "Shah Ali Market", "Shahbag", "Shahjahanpur", 
    "Sher-e-Bangla Nagar", "Shyampur", "Sutrapur", "Tejgaon", 
    "Tejgaon Industrial Area", "Turag", "Uttara", "Uttarkhan", "Vasantek", 
    "Vatara", "Wari", "Zone not clear"
  ];

  const subUrbanThanas = [
    "Ashulia", "Dhamrai", "Dohar", "Hemayetpur", "Keraniganj Model", "Nawabganj", 
    "Savar", "South Keraniganj"
  ];

  const divisions = [
    "Barishal", "Chattogram", "Dhaka", "Khulna", "Rajshahi", "Rangpur", "Mymensingh", "Sylhet"
  ];

  const districts = [
    "Dhaka City", "Dhaka Sub-Urban", "Bagerhat", "Bandarban", "Barguna", "Barishal", "Bhola", "Bogra", "Brahmanbaria", "Chandpur", "Chapainawabganj", "Chattogram", "Chuadanga", "Comilla", "Cox's Bazar", "Dinajpur", "Faridpur", "Feni", "Gaibandha", "Gazipur", "Gopalganj", "Habiganj", "Jamalpur", "Jashore", "Jhalokati", "Jhenaidah", "Joypurhat", "Khagrachari", "Khulna", "Kishoreganj", "Kurigram", "Kushtia", "Lakshmipur", "Lalmonirhat", "Madaripur", "Magura", "Manikganj", "Meherpur", "Moulvibazar", "Munshiganj", "Mymensingh", "Naogaon", "Narail", "Narayanganj", "Narsingdi", "Natore", "Netrokona", "Nilphamari", "Noakhali", "Pabna", "Panchagarh", "Patuakhali", "Pirojpur", "Rajbari", "Rajshahi", "Rangamati", "Rangpur", "Satkhira", "Shariatpur", "Sherpur", "Sirajganj", "Sunamganj", "Sylhet", "Tangail", "Thakurgaon"
  ];

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  const calculateFinalDeliveryFee = () => {
    const district = billingDetails.district.toLowerCase();
    const thana = (billingDetails.thanaUpazilla || "").toLowerCase();
    
    // Savar is outside Dhaka City
    const isSavar = thana === 'savar';
    const isDhakaCity = district === 'dhaka city' && !isSavar;
    
    const location = isDhakaCity ? 'Inside Dhaka' : 'Outside Dhaka';
    
    // Check for free delivery coupon
    if (cartState.appliedCoupon?.code?.includes('FREE') || 
        (cartState.appliedCoupon?.discount === 0 && cartState.appliedCoupon?.code)) {
      return 0;
    }
    
    return calculateWeightedDeliveryFee(location, district);
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
        setCreatedOrderId(data.invoice._id);
        setShowPayment(true);
        toast({
          title: "Order created successfully!",
          description: "Please complete your payment to confirm the order.",
        });
      } else {
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(billingDetails.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

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

    const totalWeight = cartState.items.reduce((sum, item) => {
      const weightNum = parseFloat((item as any).weight?.replace(/[^0-9.]/g, '') || '0');
      return sum + (weightNum * (item.quantity || 1));
    }, 0);

    const orderData = {
      userId: user?.id || 'guest',
      total: finalTotal,
      totalWeight,
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
        productId: (item as any).productId || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        weight: (item as any).weight,
        color: (item as any).color
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
    setLocation(`/invoice/${createdOrderId}`);
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
    return null;
  }

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
            <div className="lg:col-span-2 space-y-6">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <Label htmlFor="customer-email" className="text-[#26732d] font-medium text-sm sm:text-base mb-1.5 block">Email Address *</Label>
                        <Input
                          id="customer-email"
                          type="email"
                          value={billingDetails.email}
                          onChange={(e) => setBillingDetails(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Enter your email"
                          required
                          className="h-11 sm:h-10 border-gray-300 focus:border-[#26732d] focus:ring-[#26732d] text-base"
                          data-testid="input-email"
                        />
                      </div>
                      <div>
                        <Label htmlFor="district" className="text-[#26732d] font-medium text-sm sm:text-base mb-1.5 block">District *</Label>
                        <RadioGroup
                          value={billingDetails.district}
                          onValueChange={(val) => setBillingDetails(prev => ({ ...prev, district: val }))}
                          className="flex flex-col gap-2 mt-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Dhaka City" id="dhaka-city" />
                            <Label htmlFor="dhaka-city">Dhaka City</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Outside Dhaka City" id="outside-dhaka" />
                            <Label htmlFor="outside-dhaka">Outside Dhaka City</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="customer-address" className="text-[#26732d] font-medium text-sm sm:text-base mb-1.5 block">Full Address *</Label>
                      <Textarea
                        id="customer-address"
                        value={billingDetails.address}
                        onChange={(e) => setBillingDetails(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="House number, street name, area, etc."
                        required
                        className="min-h-[100px] border-gray-300 focus:border-[#26732d] focus:ring-[#26732d] text-base"
                        data-testid="input-address"
                      />
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card className="border-[#26732d]/30">
                <CardHeader className="bg-[#26732d]/5 p-4 sm:p-6">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-[#26732d]" />
                    <CardTitle className="text-lg sm:text-xl text-[#26732d]">Payment Method</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                    <div className="flex items-center space-x-3 space-y-0 bg-gray-50 p-4 rounded-lg border hover:border-[#26732d] transition-colors cursor-pointer">
                      <RadioGroupItem value="COD" id="cod" />
                      <Label htmlFor="cod" className="flex flex-1 items-center gap-3 cursor-pointer">
                        <Truck className="h-5 w-5 text-[#26732d]" />
                        <div>
                          <p className="font-semibold text-gray-900">Cash on Delivery</p>
                          <p className="text-xs text-gray-500">Pay when you receive your order</p>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-3 space-y-0 bg-gray-50 p-4 rounded-lg border hover:border-[#26732d] transition-colors cursor-pointer">
                      <RadioGroupItem value="RupantorPay" id="rupantor" />
                      <Label htmlFor="rupantor" className="flex flex-1 items-center gap-3 cursor-pointer">
                        <CreditCard className="h-5 w-5 text-[#26732d]" />
                        <div>
                          <p className="font-semibold text-gray-900">Online Payment</p>
                          <p className="text-xs text-gray-500">Pay securely via RupantorPay (bKash, Nagad, Card)</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-20 border-[#26732d]/30 shadow-md">
                <CardHeader className="bg-[#26732d] text-white p-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-4">
                  <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {cartState.items.map((item) => (
                      <div key={item.id} className="flex gap-3 py-3 border-b last:border-0">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover border" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.quantity} x ৳{item.price}</p>
                        </div>
                        <p className="text-sm font-bold text-gray-900">৳{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>৳{cartState.total}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Fee</span>
                      <span>৳{finalDeliveryFee}</span>
                    </div>
                    {cartState.appliedCoupon && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({cartState.appliedCoupon.code})</span>
                        <span>-৳{cartState.appliedCoupon.discount}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-xl font-bold text-[#26732d]">
                      <span>Total</span>
                      <span>৳{getFinalTotal() + finalDeliveryFee}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full h-12 bg-[#ffde59] hover:bg-[#e6c950] text-black font-bold text-lg shadow-lg"
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'PLACE ORDER NOW'}
                  </Button>

                  <div className="text-center">
                    <p className="text-[10px] text-gray-500 flex items-center justify-center gap-1">
                      <Truck className="h-3 w-3" />
                      Safe and Secure Delivery
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
