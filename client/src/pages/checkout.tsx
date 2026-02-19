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
import { ChevronDown, ChevronUp, CreditCard, Truck, User, MapPin, MessageSquare, ShoppingBag, Tag, Phone } from 'lucide-react';
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
    
    if (cartState.appliedCoupon?.code?.includes('FREE') || 
        (cartState.appliedCoupon?.discount === 0 && cartState.appliedCoupon?.code)) {
      return 0;
    }

    const totalWeight = cartState.items.reduce((sum, item) => {
      const weightNum = parseFloat((item as any).weight?.replace(/[^0-9.]/g, '') || '0');
      return sum + (weightNum * (item.quantity || 1));
    }, 0);

    let baseFee = 130;
    let baseWeight = 1;
    let extraWeightFee = 20;

    if (district === 'dhaka city') {
      baseFee = 80;
      baseWeight = 2;
    }

    let finalFee = baseFee;
    if (totalWeight > baseWeight) {
      const extraWeight = Math.ceil(totalWeight - baseWeight);
      finalFee += extraWeight * extraWeightFee;
    }
    
    return finalFee;
  };

  const finalDeliveryFee = calculateFinalDeliveryFee();

  useEffect(() => {
    if (cartState.items.length === 0) {
      setLocation('/');
    }
  }, [cartState.items.length, setLocation]);

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim(), orderAmount: cartState.total }),
      });
      const data = await response.json();
      if (response.ok && data.valid) {
        const discountAmount = data.coupon.discountType === 'free_delivery' ? 0 : data.coupon.discountAmount;
        applyCoupon({ code: data.coupon.code, discount: discountAmount });
        setCouponCode('');
        setCouponError('');
        toast({ title: "Coupon applied successfully!", description: data.coupon.discountType === 'free_delivery' ? "Your delivery fee has been waived!" : `You saved ৳${data.coupon.discountAmount}` });
      } else {
        setCouponError(data.message || 'Invalid coupon code');
      }
    } catch (error) {
      setCouponError('Failed to validate coupon. Please try again.');
    } finally {
      setIsCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    toast({ title: "Coupon removed", description: "Discount has been removed from your order." });
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
      } else {
        clearCart();
        toast({ title: "Order placed successfully!", description: `Order #${data.invoice.invoiceNumber} has been created.` });
        setLocation(`/invoice/${data.invoice._id}`);
      }
    },
    onError: () => {
      toast({ title: "Order failed", description: "Something went wrong. Please try again.", variant: "destructive" });
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
      toast({ title: "Missing Required Information", description: `Please fill in: ${missingFields.join(', ')}`, variant: "destructive" });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(billingDetails.email)) {
      toast({ title: "Invalid Email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }
    const phoneRegex = /^(\+88)?01[3-9]\d{8}$/;
    if (!phoneRegex.test(billingDetails.phone.replace(/\s/g, ''))) {
      toast({ title: "Invalid Phone Number", description: "Please enter a valid Bangladesh mobile number.", variant: "destructive" });
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
      subtotal: cartState.total,
      deliveryFee: finalDeliveryFee,
      discount: cartState.appliedCoupon ? cartState.appliedCoupon.discount : 0,
      discountCode: cartState.appliedCoupon ? cartState.appliedCoupon.code : null,
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
      paymentMethod,
      shippingAddress: {
        address: billingDetails.address,
        division: billingDetails.division,
        district: billingDetails.district,
        thanaUpazilla: billingDetails.thanaUpazilla,
        postCode: billingDetails.postCode
      },
      orderNotes: orderNotes
    };
    try { await createOrderMutation.mutateAsync(orderData); } catch (error) { console.error('Order creation failed:', error); } finally { setIsProcessing(false); }
  };

  const handlePaymentSuccess = (transactionId: string) => {
    clearCart();
    setShowPayment(false);
    toast({ title: "Payment successful!", description: `Transaction ID: ${transactionId}` });
    setLocation(`/invoice/${createdOrderId}`);
  };

  const handlePaymentError = (error: string) => {
    setShowPayment(false);
    toast({ title: "Payment failed", description: error, variant: "destructive" });
  };

  if (cartState.items.length === 0) return null;

  if (showPayment && createdOrderId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="py-8">
          <div className="max-w-2xl mx-auto px-4">
            <PaymentProcessor
              orderId={createdOrderId}
              amount={getFinalTotal() + finalDeliveryFee}
              customerInfo={{ fullname: `${billingDetails.firstName} ${billingDetails.lastName}`.trim(), email: billingDetails.email, phone: billingDetails.phone }}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
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
                <h1 className="text-xl sm:text-3xl font-bold text-[#26732d]">Checkout</h1>
              </div>
              <p className="text-sm sm:text-lg font-semibold text-[#26732d] flex items-center gap-2">
                <Phone size={18} className="text-[#26732d]" />
                01405-045023
              </p>
            </div>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-[#26732d]/30">
                <CardHeader className="bg-[#26732d]/5 p-4 sm:p-6"><CardTitle className="text-lg sm:text-xl text-[#26732d]">Order Details</CardTitle></CardHeader>
                <CardContent className="p-4 sm:pt-6 sm:px-6">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><Label>First Name *</Label><Input value={billingDetails.firstName} onChange={(e) => setBillingDetails(prev => ({ ...prev, firstName: e.target.value }))} required /></div>
                        <div><Label>Last Name</Label><Input value={billingDetails.lastName} onChange={(e) => setBillingDetails(prev => ({ ...prev, lastName: e.target.value }))} /></div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><Label>Phone *</Label><Input value={billingDetails.phone} onChange={(e) => setBillingDetails(prev => ({ ...prev, phone: e.target.value }))} required /></div>
                        <div><Label>Email Address *</Label><Input value={billingDetails.email} onChange={(e) => setBillingDetails(prev => ({ ...prev, email: e.target.value }))} required /></div>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-[#26732d]">Customer Address</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div><Label>Division *</Label><select value={billingDetails.division} onChange={(e) => setBillingDetails(prev => ({ ...prev, division: e.target.value, district: '', thanaUpazilla: '' }))} className="w-full h-10 border rounded px-2 bg-white text-black" required><option value="">Select Division</option>{divisions.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                        <div><Label>District *</Label><select value={billingDetails.district} onChange={(e) => setBillingDetails(prev => ({ ...prev, district: e.target.value, thanaUpazilla: '' }))} className="w-full h-10 border rounded px-2 bg-white text-black" required><option value="">Select District</option>{districts.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                        <div><Label>Upazilla/Thana *</Label>{(billingDetails.district === 'Dhaka City' || billingDetails.district === 'Dhaka Sub-Urban') ? (<select value={billingDetails.thanaUpazilla} onChange={(e) => setBillingDetails(prev => ({ ...prev, thanaUpazilla: e.target.value }))} className="w-full h-10 border rounded px-2 bg-white text-black" required><option value="">Select Thana</option>{(billingDetails.district === 'Dhaka City' ? dhakaThanas : subUrbanThanas).map(t => <option key={t} value={t}>{t}</option>)}</select>) : (<Input value={billingDetails.thanaUpazilla} onChange={(e) => setBillingDetails(prev => ({ ...prev, thanaUpazilla: e.target.value }))} className="bg-white text-black" required />)}</div>
                      </div>
                          <div><Label>Full Address *</Label><Textarea value={billingDetails.address} onChange={(e) => setBillingDetails(prev => ({ ...prev, address: e.target.value }))} required /></div>
                          <div><Label>Order Notes (Optional)</Label><Textarea value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)} placeholder="Add any special instructions for your order" /></div>
                        </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card className="border-[#26732d]/30 sticky top-4">
                <CardHeader className="bg-[#26732d]/5 p-4 sm:p-6"><CardTitle className="text-lg sm:text-xl text-[#26732d]">Order Summary</CardTitle></CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-4">
                    {cartState.items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <img src={item.image} className="w-16 h-16 rounded object-cover" />
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          {(item as any).weight || (item as any).color ? (
                            <div className="flex flex-wrap gap-2 mt-1">
                              {(item as any).weight && (
                                <Badge variant="outline" className="text-[10px] h-4 px-1 border-gray-300">
                                  { (item as any).weight }
                                </Badge>
                              )}
                              {(item as any).color && (
                                <Badge variant="outline" className="text-[10px] h-4 px-1 border-gray-300">
                                  { (item as any).color }
                                </Badge>
                              )}
                            </div>
                          ) : null}
                          <p className="text-sm text-gray-500">Qty: {item.quantity} x ৳{item.price}</p>
                        </div>
                      </div>
                    ))}
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex justify-between"><span>Subtotal</span><span>৳{cartState.total}</span></div>
                      {cartState.appliedCoupon ? (
                        <div className="flex justify-between text-red-600">
                          <span>Discount ({cartState.appliedCoupon.code})</span>
                          <div className="flex items-center gap-2">
                            <span>-৳{cartState.appliedCoupon.discount}</span>
                            <Button variant="ghost" size="sm" onClick={handleRemoveCoupon} className="h-6 w-6 p-0 text-red-600 hover:text-red-800">×</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="pt-2">
                          <Button 
                            variant="link" 
                            onClick={() => setShowCoupon(!showCoupon)}
                            className="p-0 h-auto text-[#26732d] hover:text-[#1e5d26] text-sm font-medium"
                          >
                            Have a coupon? Click here to enter your code
                          </Button>
                          {showCoupon && (
                            <div className="mt-2 flex gap-2">
                              <Input 
                                placeholder="Coupon code" 
                                value={couponCode} 
                                onChange={(e) => setCouponCode(e.target.value)}
                                className="h-9 text-sm"
                              />
                              <Button 
                                onClick={handleApplyCoupon} 
                                disabled={isCouponLoading}
                                className="bg-[#26732d] hover:bg-[#1e5d26] h-9 text-sm px-3"
                              >
                                {isCouponLoading ? "..." : "Apply"}
                              </Button>
                            </div>
                          )}
                          {couponError && <p className="text-xs text-red-600 mt-1">{couponError}</p>}
                        </div>
                      )}
                      <div className="flex justify-between"><span>Delivery Fee</span><span>৳{finalDeliveryFee}</span></div>
                      <div className="flex justify-between font-bold text-lg text-[#26732d]"><span>Total</span><span>৳{getFinalTotal() + finalDeliveryFee}</span></div>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                      <Label className="font-bold">Payment Method</Label>
                      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
                        <div className="flex items-center space-x-2 border p-3 rounded hover:border-[#26732d]"><RadioGroupItem value="COD" id="sum-cod" /><Label htmlFor="sum-cod">Cash on Delivery</Label></div>
                        <div className="flex items-center space-x-2 border p-3 rounded hover:border-[#26732d]"><RadioGroupItem value="RupantorPay" id="sum-rp" /><Label htmlFor="sum-rp">RupantorPay(Bkash, Nagad, Rocket)</Label></div>
                      </RadioGroup>
                    </div>
                    <Button className="w-full bg-[#ffde59] hover:bg-[#e6c950] text-black font-bold h-12 text-lg" onClick={handlePlaceOrder} disabled={isProcessing}>{isProcessing ? "Processing..." : "Place Order Now"}</Button>
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
