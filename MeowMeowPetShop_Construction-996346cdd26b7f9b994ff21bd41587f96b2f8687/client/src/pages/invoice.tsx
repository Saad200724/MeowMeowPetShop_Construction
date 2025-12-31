import { useState } from 'react';
import { useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Printer, ArrowLeft, CheckCircle } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useQuery } from '@tanstack/react-query';

interface InvoiceItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Invoice {
  _id: string;
  invoiceNumber: string;
  orderId: string;
  userId: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address?: any;
  };
  items: InvoiceItem[];
  subtotal: number;
  discount?: number;
  discountCode?: string;
  deliveryFee?: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderDate: string;
  createdAt: string;
  updatedAt: string;
}

export default function InvoicePage() {
  const [match, params] = useRoute('/invoice/:invoiceId');
  const { toast } = useToast();

  const { data: invoice, isLoading, error } = useQuery({
    queryKey: [`/api/invoices/${params?.invoiceId}`],
    enabled: !!params?.invoiceId,
  });

  const handlePrint = () => {
    const printContents = document.querySelectorAll('.print-invoice');
    if (printContents.length === 0) return;
    
    const originalContent = document.body.innerHTML;
    let combinedHTML = '';
    
    printContents.forEach((element, index) => {
      combinedHTML += element.outerHTML;
      if (index < printContents.length - 1) {
        combinedHTML += '<div style="page-break-after: always;"></div>';
      }
    });
    
    document.body.innerHTML = combinedHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-8 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Invoice Not Found</h1>
            <p className="text-gray-600 mb-6">The invoice you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => window.history.back()} className="bg-[#26732d] hover:bg-[#1e5d26]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
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
          
          {/* Success Message */}
          <Card className="mb-6 bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <h2 className="text-xl font-bold text-green-800">Order Placed Successfully!</h2>
                  <p className="text-green-600">
                    Thank you for your order. Your invoice #{invoice.invoiceNumber} has been generated.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-1 mb-6">
            <Button 
              onClick={() => window.history.back()}
              className="bg-[#26732d] hover:bg-[#1e5d26] text-white hover:text-white flex items-center space-x-2"
              data-testid="button-back-shopping"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Shopping</span>
            </Button>
            
            <Button 
              onClick={handlePrint}
              className="bg-[#26732d] hover:bg-[#1e5d26] text-white hover:text-white flex items-center space-x-2"
              data-testid="button-print-invoice"
            >
              <Printer className="h-4 w-4" />
              <span>Print Invoice</span>
            </Button>
          </div>

          {/* Invoice */}
          <Card className="print-invoice print:shadow-none print:border-none">
            <CardHeader className="border-b">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center mb-3">
                    <img src="/logo.png" alt="Meow Meow Pet Shop Logo" className="h-12 w-12 mr-3" />
                    <CardTitle className="text-3xl font-bold text-[#26732d]">
                      Meow Meow Pet Shop
                    </CardTitle>
                  </div>
                  <p className="text-gray-600 mt-2">
                    Savar, Bangladesh<br />
                    Email: meowmeowpetshop1@gmail.com<br />
                    Phone: 01405-045023
                  </p>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-bold text-gray-900">INVOICE</h2>
                  <p className="text-lg font-semibold text-[#26732d]">
                    #{invoice.invoiceNumber}
                  </p>
                  <p className="text-gray-600">
                    Date: {new Date(invoice.orderDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {/* Customer Information */}
              <div className="grid md:grid-cols-2 gap-1 mb-8">
                <div>
                  <h3 className="font-bold text-lg mb-3">Bill To:</h3>
                  <div className="space-y-1">
                    <p className="font-semibold">{invoice.customerInfo.name}</p>
                    <p>{invoice.customerInfo.email}</p>
                    <p>{invoice.customerInfo.phone}</p>
                    {invoice.customerInfo.address && (
                      <div className="text-gray-600 space-y-1">
                        {typeof invoice.customerInfo.address === 'string' ? (
                          <p>{invoice.customerInfo.address}</p>
                        ) : (
                          <>
                            <p>{invoice.customerInfo.address.address}</p>
                            {invoice.customerInfo.address.thanaUpazilla && (
                              <p>{invoice.customerInfo.address.thanaUpazilla}</p>
                            )}
                            <p>
                              {invoice.customerInfo.address.district}, {invoice.customerInfo.address.division}
                              {invoice.customerInfo.address.postCode && ` - ${invoice.customerInfo.address.postCode}`}
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-3">Order Details:</h3>
                  <div className="space-y-1">
                    <p><span className="font-medium">Order ID:</span> {invoice.orderId}</p>
                    <p><span className="font-medium">Payment Method:</span> {invoice.paymentMethod}</p>
                    <p>
                      <span className="font-medium">Payment Status:</span>
                      <Badge 
                        variant={invoice.paymentStatus === 'Paid' ? 'default' : 'secondary'}
                        className="ml-2"
                      >
                        {invoice.paymentStatus}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-8">
                <h3 className="font-bold text-lg mb-4">Items Ordered:</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-3 text-left">Product</th>
                        <th className="border border-gray-300 p-3 text-center">Quantity</th>
                        <th className="border border-gray-300 p-3 text-right">Price</th>
                        <th className="border border-gray-300 p-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border border-gray-300 p-3">
                            <div className="flex items-center space-x-3">
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <span className="font-medium">{item.name}</span>
                            </div>
                          </td>
                          <td className="border border-gray-300 p-3 text-center">
                            {item.quantity}
                          </td>
                          <td className="border border-gray-300 p-3 text-right">
                            ৳ {item.price.toLocaleString()}
                          </td>
                          <td className="border border-gray-300 p-3 text-right font-medium">
                            ৳ {(item.price * item.quantity).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-full md:w-1/2 lg:w-1/3 space-y-2">
                  <Separator />
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>৳ {invoice.subtotal.toLocaleString()}</span>
                  </div>
                  {invoice.deliveryFee !== undefined && invoice.deliveryFee > 0 && (
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span>৳ {invoice.deliveryFee.toLocaleString()}</span>
                    </div>
                  )}
                  {invoice.discount !== undefined && invoice.discount > 0 && (
                    <div className="flex justify-between">
                      <span>Discount {invoice.discountCode && `(${invoice.discountCode})`}:</span>
                      <span className="text-green-600">-৳ {invoice.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span className="text-[#26732d]">৳ {invoice.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t text-center text-gray-600">
                <p>Thank you for shopping with Meow Meow Pet Shop!</p>
                <p className="text-sm mt-2">
                  For any queries, please contact us at meowmeowpetshop1@gmail.com
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}