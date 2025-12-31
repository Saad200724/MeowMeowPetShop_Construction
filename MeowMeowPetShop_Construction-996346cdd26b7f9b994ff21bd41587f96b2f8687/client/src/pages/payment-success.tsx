
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Receipt, Home } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function PaymentSuccessPage() {
  const [, setLocation] = useLocation();
  const [paymentInfo, setPaymentInfo] = useState<any>(null);

  useEffect(() => {
    // URL থেকে payment info extract করি
    const urlParams = new URLSearchParams(window.location.search);
    const transactionId = urlParams.get('transactionId');
    const amount = urlParams.get('amount');
    const status = urlParams.get('status');

    if (transactionId && status === 'COMPLETED') {
      setPaymentInfo({
        transactionId,
        amount,
        timestamp: new Date().toLocaleString()
      });
    }
  }, []);

  if (!paymentInfo) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-600">Loading...</h1>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-green-800">
                Payment Successful! 🎉
              </CardTitle>
              <p className="text-green-700 mt-2">
                আপনার payment সফলভাবে সম্পন্ন হয়েছে
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="bg-white rounded-lg p-6 border border-green-200">
                <h3 className="font-semibold text-gray-800 mb-4">Payment Details:</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {paymentInfo.transactionId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid:</span>
                    <span className="font-semibold text-green-600">
                      ৳{paymentInfo.amount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Time:</span>
                    <span className="text-gray-800">
                      {paymentInfo.timestamp}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">What's Next?</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• আপনার order confirm হয়ে গেছে</li>
                  <li>• আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব</li>
                  <li>• Delivery এর জন্য 1-3 working days সময় লাগবে</li>
                  <li>• Email/SMS এ confirmation পাবেন</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {paymentInfo.orderId && (
                  <Button 
                    onClick={() => setLocation('/invoice/' + paymentInfo.orderId)}
                    className="flex-1 bg-[#26732d] hover:bg-[#1e5d26]"
                  >
                    <Receipt className="w-4 h-4 mr-2" />
                    View Invoice
                  </Button>
                )}
                <Button 
                  onClick={() => setLocation('/')}
                  variant="outline"
                  className="flex-1"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </div>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-600">
                  কোন সমস্যা হলে যোগাযোগ করুন: 
                  <a href="tel:01405588433" className="text-[#26732d] font-medium ml-1">
                    01405588433
                  </a>
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
