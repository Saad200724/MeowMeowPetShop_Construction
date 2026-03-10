import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Package, CheckCircle, Truck, MapPin, Clock } from 'lucide-react';

interface OrderTrack {
  orderNumber: string;
  invoiceNumber: string;
  status: string;
  total: number;
  customerInfo: { name: string; phone: string; email: string; address?: any };
  items: any[];
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

export default function TrackOrderPage() {
  const { toast } = useToast();
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState<OrderTrack | null>(null);
  const [searched, setSearched] = useState(false);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    if (!orderId.trim() || !phone.trim()) {
      toast({ title: 'Missing Information', description: 'Please enter both Order ID and Phone Number', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/track-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId: orderId.trim(), phone: phone.trim().replace(/\s/g, '') }) });
      const data = await response.json();
      if (response.ok) {
        setOrderData(data);
        toast({ title: 'Order Found', description: `Order #${data.orderNumber} loaded successfully` });
      } else {
        setOrderData(null);
        toast({ title: 'Order Not Found', description: data.message || 'No matching order found.', variant: 'destructive' });
      }
    } catch (error) {
      setOrderData(null);
      toast({ title: 'Error', description: 'Failed to track order. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const statusSteps = orderData ? ['pending', 'processing', 'shipped', 'delivered'].map((s, i) => ({ status: s, completed: ['pending', 'processing', 'shipped', 'delivered'].indexOf(orderData.status?.toLowerCase() || 'pending') >= i })) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-[#26732d]/30 mb-8">
            <CardHeader className="bg-[#26732d]/5">
              <CardTitle className="text-[#26732d] flex items-center gap-2">
                <Truck size={24} />
                Track Your Order
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleTrackOrder} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label htmlFor="orderId">Order ID or Invoice Number *</Label><Input id="orderId" placeholder="e.g., XBEPO or INV-XXXX-XXXX" value={orderId} onChange={(e) => setOrderId(e.target.value)} data-testid="input-order-id" /></div>
                  <div><Label htmlFor="phone">Phone Number *</Label><Input id="phone" placeholder="01815XXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} data-testid="input-phone" /></div>
                </div>
                <Button type="submit" disabled={isLoading} className="w-full bg-[#26732d] hover:bg-[#1e5d26] h-10" data-testid="button-track-order">{isLoading ? 'Tracking...' : 'Track Order'}</Button>
              </form>
            </CardContent>
          </Card>

          {searched && !orderData && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-red-600 text-center">No order found. Please check your Order ID and Phone Number and try again.</p>
              </CardContent>
            </Card>
          )}

          {orderData && (
            <div className="space-y-8">
              <Card className="border-[#26732d]/30">
                <CardHeader className="bg-[#26732d]/5">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-[#26732d]">Order #{orderData.orderNumber}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">Invoice: {orderData.invoiceNumber}</p>
                    </div>
                    <Badge className={orderData.status?.toLowerCase() === 'delivered' ? 'bg-green-100 text-green-800' : orderData.status?.toLowerCase() === 'shipped' ? 'bg-blue-100 text-blue-800' : orderData.status?.toLowerCase() === 'processing' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}>
                      {orderData.status?.charAt(0).toUpperCase() + orderData.status?.slice(1) || 'Pending'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><p className="text-sm text-gray-600 font-medium">Customer Name</p><p className="text-lg font-semibold text-gray-900">{orderData.customerInfo.name}</p></div>
                    <div><p className="text-sm text-gray-600 font-medium">Phone Number</p><p className="text-lg font-semibold text-gray-900">{orderData.customerInfo.phone}</p></div>
                    <div><p className="text-sm text-gray-600 font-medium">Order Date</p><p className="text-lg font-semibold text-gray-900">{new Date(orderData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p></div>
                    <div><p className="text-sm text-gray-600 font-medium">Order Total</p><p className="text-lg font-semibold text-[#26732d]">৳{orderData.total.toLocaleString()}</p></div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#26732d]/30">
                <CardHeader className="bg-[#26732d]/5"><CardTitle className="text-[#26732d]">Delivery Status</CardTitle></CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {statusSteps.map((step) => (
                      <div key={step.status} className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${step.completed ? 'bg-[#26732d] text-white' : 'bg-gray-200 text-gray-500'}`}>
                          {step.completed ? <CheckCircle size={24} /> : <Clock size={24} />}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 capitalize">{step.status}</p>
                          <p className="text-sm text-gray-600">{step.completed && step.status === orderData.status?.toLowerCase() ? `Updated on ${new Date(orderData.updatedAt).toLocaleDateString()}` : step.completed ? 'Completed' : 'Pending'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#26732d]/30">
                <CardHeader className="bg-[#26732d]/5"><CardTitle className="text-[#26732d]">Items Ordered</CardTitle></CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {orderData.items.map((item, index) => (
                      <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                        {item.image && <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover" />}
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          <p className="text-sm font-medium text-gray-900">৳{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {orderData.customerInfo.address && (
                <Card className="border-[#26732d]/30">
                  <CardHeader className="bg-[#26732d]/5"><CardTitle className="text-[#26732d] flex items-center gap-2"><MapPin size={20} />Delivery Address</CardTitle></CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-gray-900">{orderData.customerInfo.address.address}</p>
                    <p className="text-sm text-gray-600 mt-2">{orderData.customerInfo.address.thanaUpazilla}, {orderData.customerInfo.address.district}, {orderData.customerInfo.address.division}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {!searched && !orderData && (
            <Card className="border-gray-200 bg-gray-50">
              <CardContent className="pt-6 text-center">
                <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Enter your Order ID and Phone Number above to track your order status</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}