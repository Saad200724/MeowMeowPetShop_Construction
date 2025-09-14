import { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useQuery } from '@tanstack/react-query';

interface TrackingEvent {
  id: string;
  status: string;
  description: string;
  date: string;
  time: string;
  location?: string;
}

interface Order {
  id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: string;
  total: number;
  items: { name: string; quantity: number; price: number }[];
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  tracking: TrackingEvent[];
  estimatedDelivery?: string;
}

export default function TrackOrderPage() {
  const [match, params] = useRoute('/track-order/:orderId');
  const { toast } = useToast();

  // Mock data for demonstration - replace with real API call
  const mockOrder: Order = {
    id: params?.orderId || 'ORD-2025-001',
    status: 'processing',
    date: '2025-01-27',
    total: 89.99,
    items: [
      { name: 'Royal Canin Cat Food 2kg', quantity: 1, price: 45.99 },
      { name: 'Cat Interactive Toy', quantity: 2, price: 22.00 }
    ],
    customerInfo: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+880 1234567890',
      address: '123 Main Street, Dhaka, Bangladesh'
    },
    tracking: [
      {
        id: '1',
        status: 'Order Placed',
        description: 'Your order has been placed successfully',
        date: '2025-01-27',
        time: '10:30 AM',
        location: 'Meow Meow Pet Shop'
      },
      {
        id: '2',
        status: 'Processing',
        description: 'Your order is being prepared for shipment',
        date: '2025-01-27',
        time: '2:15 PM',
        location: 'Warehouse - Savar'
      },
      {
        id: '3',
        status: 'Shipped',
        description: 'Your order has been shipped and is on the way',
        date: '2025-01-28',
        time: '9:00 AM',
        location: 'Delivery Hub - Dhaka'
      }
    ],
    estimatedDelivery: '2025-01-29'
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'shipped': return <Truck className="h-5 w-5 text-blue-600" />;
      case 'processing': return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'pending': return <Package className="h-5 w-5 text-gray-600" />;
      default: return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  const getProgressValue = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 25;
      case 'processing': return 50;
      case 'shipped': return 75;
      case 'delivered': return 100;
      default: return 0;
    }
  };

  if (!params?.orderId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
            <p className="text-gray-600 mb-6">Please check your order ID and try again.</p>
            <Link href="/dashboard">
              <Button className="bg-[#26732d] hover:bg-[#1e5d26]">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Track Your Order</h1>
              <p className="text-gray-600">Order ID: {mockOrder.id}</p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
            </Link>
          </div>

          {/* Order Status */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  {getStatusIcon(mockOrder.status)}
                  <span>Order Status</span>
                </CardTitle>
                <Badge className={getStatusColor(mockOrder.status)}>
                  {mockOrder.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{getProgressValue(mockOrder.status)}%</span>
                  </div>
                  <Progress value={getProgressValue(mockOrder.status)} className="h-2" />
                </div>
                
                {mockOrder.estimatedDelivery && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Estimated Delivery: {new Date(mockOrder.estimatedDelivery).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Order Info */}
            <Card>
              <CardHeader>
                <CardTitle>Order Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Order Date</label>
                  <p className="mt-1">{new Date(mockOrder.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Total Amount</label>
                  <p className="mt-1 text-lg font-bold text-[#26732d]">৳{mockOrder.total.toFixed(2)}</p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-gray-700">Items Ordered</label>
                  <div className="mt-2 space-y-2">
                    {mockOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.name} x{item.quantity}</span>
                        <span>৳{item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Customer Name</label>
                  <p className="mt-1">{mockOrder.customerInfo.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{mockOrder.customerInfo.email}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{mockOrder.customerInfo.phone}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Delivery Address</label>
                  <div className="flex items-start space-x-2 mt-1">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <span className="text-sm">{mockOrder.customerInfo.address}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tracking Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Tracking Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockOrder.tracking.map((event, index) => (
                  <div key={event.id} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-[#26732d] rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      {index < mockOrder.tracking.length - 1 && (
                        <div className="w-0.5 h-12 bg-gray-200 ml-4 mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">{event.status}</h4>
                        <div className="text-sm text-gray-500">
                          {event.date} at {event.time}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      {event.location && (
                        <div className="flex items-center space-x-1 mt-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Need Help?</h3>
                <p className="text-gray-600 mb-4">
                  If you have any questions about your order, feel free to contact our customer support.
                </p>
                <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>Call: 01405-045023</span>
                  </Button>
                  <Link href="/contact">
                    <Button className="bg-[#26732d] hover:bg-[#1e5d26] flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>Contact Support</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
      
      <Footer />
    </div>
  );
}