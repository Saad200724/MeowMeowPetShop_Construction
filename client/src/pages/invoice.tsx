import { useState } from 'react';
import { useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Printer, ArrowLeft, CheckCircle } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

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

  const { data: invoice, isLoading, error } = useQuery<Invoice>({
    queryKey: [`/api/invoices/${params?.invoiceId}`],
    enabled: !!params?.invoiceId,
  });

  const handlePrint = () => {
    window.print();
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
    <div className="min-h-screen bg-gray-50 pb-10">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-[210mm] mx-auto">
          
          {/* Success Message */}
          <Card className="mb-6 bg-green-50 border-green-200 print:hidden">
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
          <div className="flex flex-wrap gap-1 mb-6 print:hidden">
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
              <span>Print Invoice (A4)</span>
            </Button>
          </div>

          {/* Invoice A4 Container */}
          <div className="print-invoice w-[210mm] min-h-[297mm] mx-auto bg-white p-[20mm] box-border shadow-lg print:shadow-none mb-10 print:m-0 print:border-none">
            <div className="border-b pb-6 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center mb-3">
                    <img src="/logo.png" alt="Meow Meow Pet Shop Logo" className="h-12 w-12 mr-3" />
                    <h1 className="text-3xl font-bold text-[#26732d]">
                      Meow Meow Pet Shop
                    </h1>
                  </div>
                  <p className="text-gray-600 mt-2 text-sm">
                    Savar, Bangladesh<br />
                    Email: meowmeowpetshop1@gmail.com<br />
                    Phone: 01405-045023
                  </p>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wider">Invoice</h2>
                  <p className="text-lg font-semibold text-[#26732d] mt-1">
                    #{invoice.invoiceNumber}
                  </p>
                  <p className="text-gray-600 mt-1 text-sm">
                    Date: {new Date(invoice.orderDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-0">
              {/* Customer Information */}
              <div className="grid grid-cols-2 gap-12 mb-10">
                <div>
                  <h3 className="font-bold text-gray-900 border-b pb-2 mb-3 uppercase text-xs tracking-wider">Bill To</h3>
                  <div className="space-y-1 text-gray-700">
                    <p className="font-bold text-gray-900">{invoice.customerInfo.name}</p>
                    <p className="text-sm">{invoice.customerInfo.email}</p>
                    <p className="text-sm">{invoice.customerInfo.phone}</p>
                    {invoice.customerInfo.address && (
                      <div className="mt-2 text-sm leading-relaxed">
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
                  <h3 className="font-bold text-gray-900 border-b pb-2 mb-3 uppercase text-xs tracking-wider">Order Info</h3>
                  <div className="space-y-2 text-gray-700">
                    <div className="flex justify-between text-sm">
                      <span className="font-bold text-black">Order ID:</span>
                      <span className="text-black">{invoice.orderId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-bold text-black">Payment:</span>
                      <span className="text-black">{invoice.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-bold text-black">Status:</span>
                      <span className={cn(
                        "px-2 py-0.5 rounded text-xs font-bold uppercase",
                        invoice.paymentStatus === 'Paid' ? "bg-green-100 text-green-700" : "bg-gray-100 text-black"
                      )}>
                        {invoice.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-10">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-y-2 border-gray-200">
                      <th className="py-4 font-bold text-black uppercase text-xs tracking-wider">Description</th>
                      <th className="py-4 px-4 font-bold text-black uppercase text-xs tracking-wider text-center">Qty</th>
                      <th className="py-4 px-4 font-bold text-black uppercase text-xs tracking-wider text-right">Price</th>
                      <th className="py-4 font-bold text-black uppercase text-xs tracking-wider text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {invoice.items.map((item, index) => (
                      <tr key={index}>
                        <td className="py-4">
                          <div className="flex items-center">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-10 h-10 object-cover rounded mr-3 print:hidden"
                            />
                            <div>
                              <p className="font-bold text-black text-sm">{item.name}</p>
                              <p className="text-[10px] text-black uppercase">Unit Price: ৳ {item.price.toLocaleString()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center text-sm font-bold text-black">{item.quantity}</td>
                        <td className="py-4 px-4 text-right text-sm text-black">৳ {item.price.toLocaleString()}</td>
                        <td className="py-4 text-right text-sm font-bold text-black">৳ {(item.price * item.quantity).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-between pt-4 border-t-2 border-gray-100">
                <div className="w-1/2">
                  {invoice.customerInfo?.orderNotes && (
                    <div className="text-sm">
                      <h4 className="font-bold text-black uppercase text-xs mb-1">Additional Notes:</h4>
                      <p className="text-black italic">{invoice.customerInfo.orderNotes}</p>
                    </div>
                  )}
                </div>
                <div className="w-1/2 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-black font-medium">Subtotal</span>
                    <span className="font-bold text-black">৳ {invoice.subtotal.toLocaleString()}</span>
                  </div>
                  {invoice.deliveryFee !== undefined && invoice.deliveryFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-black font-medium">Shipping Fee</span>
                      <span className="font-bold text-black">৳ {invoice.deliveryFee.toLocaleString()}</span>
                    </div>
                  )}
                  {invoice.discount !== undefined && invoice.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-700">
                      <span className="font-medium">Discount :-৳ {invoice.discount.toLocaleString()} {invoice.discountCode && `(${invoice.discountCode})`}</span>
                      <span className="font-bold"></span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="text-lg font-bold text-black">Total Amount</span>
                    <span className="text-2xl font-black text-[#26732d]">৳ {invoice.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Notes / Footer */}
              <div className="mt-20 pt-10 border-t border-gray-100 text-center">
                <p className="text-gray-900 font-bold mb-1 italic text-sm">Thank you for your purchase!</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                  Meow Meow Pet Shop • Savar, Bangladesh • meowmeowpetshop1@gmail.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-invoice, .print-invoice * {
            visibility: visible;
          }
          .print-invoice {
            position: absolute;
            left: 0;
            top: 0;
            margin: 0 !important;
            padding: 20mm !important;
            box-shadow: none !important;
            width: 210mm !important;
            height: 297mm !important;
            border: none !important;
          }
          @page {
            size: A4;
            margin: 0;
          }
          header, footer, .print:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
