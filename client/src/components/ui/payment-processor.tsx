import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';
import { CreditCard, ExternalLink, Loader2 } from 'lucide-react';

interface PaymentProcessorProps {
  orderId: string;
  amount: number;
  customerInfo: {
    fullname: string;
    email: string;
    phone?: string;
  };
  onSuccess?: (transactionId: string) => void;
  onError?: (error: string) => void;
  metadata?: any;
}

interface PaymentResponse {
  success: boolean;
  message: string;
  paymentUrl: string;
  orderId: string;
}

export default function PaymentProcessor({
  orderId,
  amount,
  customerInfo,
  onSuccess,
  onError,
  metadata
}: PaymentProcessorProps) {
  const { toast } = useToast();
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const createPaymentMutation = useMutation({
    mutationFn: async (): Promise<PaymentResponse> => {
      console.log('Initializing payment for order:', orderId);
      console.log('Payment data:', {
        orderId,
        amount,
        customerInfo,
        metadata
      });

      try {
        const response = await apiRequest('/api/payments/create', {
          method: 'POST',
          body: JSON.stringify({
            orderId,
            amount,
            customerInfo,
            metadata
          }),
        });

        console.log('Payment API response:', response);
        return response;
      } catch (error) {
        console.error('Payment API error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Payment initialization success:', data);

      if (data.success && data.paymentUrl) {
        setPaymentUrl(data.paymentUrl);
        toast({
          title: "Payment initialized",
          description: "Click 'Pay Now' to complete your payment securely.",
        });
      } else {
        const error = data.message || data.error || "Failed to initialize payment";
        console.error('Payment initialization failed:', error);
        onError?.(error);
        toast({
          title: "Payment Error",
          description: error,
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      let errorMessage = "Payment initialization failed";
      if (error && typeof error === 'object' && 'response' in error) {
        const response = (error as any).response;
        errorMessage = response?.error || response?.message || errorMessage;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.error('Payment initialization error:', error);

      onError?.(errorMessage);
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handlePayNow = () => {
    if (paymentUrl) {
      // Open payment URL in new tab/window
      window.open(paymentUrl, '_blank', 'noopener,noreferrer');

      // Start checking payment status
      checkPaymentStatus();
    }
  };

  const checkPaymentStatus = () => {
    // Poll payment status every 5 seconds
    const statusInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/payments/status/${orderId}`);
        const data = await response.json();

        if (data.status === 'completed') {
          clearInterval(statusInterval);
          onSuccess?.(data.transactionId);
          toast({
            title: "Payment Successful!",
            description: "Your payment has been processed successfully.",
          });
        } else if (data.status === 'failed' || data.status === 'cancelled') {
          clearInterval(statusInterval);
          onError?.(`Payment ${data.status}`);
          toast({
            title: "Payment Failed",
            description: `Payment was ${data.status}. Please try again.`,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    }, 5000);

    // Stop checking after 10 minutes
    setTimeout(() => {
      clearInterval(statusInterval);
    }, 600000);
  };

  if (paymentUrl) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <CreditCard className="w-5 h-5" />
            Complete Payment
          </CardTitle>
          <CardDescription>
            Click the button below to complete your payment securely with RupantorPay
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span>Order ID:</span>
              <span className="font-mono text-sm">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount:</span>
              <span className="font-semibold">৳{amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Customer:</span>
              <span className="text-sm">{customerInfo.fullname}</span>
            </div>
          </div>

          <Button 
            onClick={handlePayNow}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Pay Now with RupantorPay
          </Button>

          <div className="text-center">
            <Badge variant="secondary" className="text-xs">
              Secure payment powered by RupantorPay
            </Badge>
          </div>

          <p className="text-xs text-gray-500 text-center">
            After clicking "Pay Now", a new window will open. Complete your payment there and return to this page.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <CreditCard className="w-5 h-5" />
          Initialize Payment
        </CardTitle>
        <CardDescription>
          Initialize secure payment with RupantorPay
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span>Order ID:</span>
            <span className="font-mono text-sm">{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span>Amount:</span>
            <span className="font-semibold">৳{amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Customer:</span>
            <span className="text-sm">{customerInfo.fullname}</span>
          </div>
        </div>

        <Button 
          onClick={() => createPaymentMutation.mutate()}
          disabled={createPaymentMutation.isPending}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          size="lg"
        >
          {createPaymentMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Initializing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Initialize Payment
            </>
          )}
        </Button>

        <div className="text-center">
          <Badge variant="secondary" className="text-xs">
            Secure payment powered by RupantorPay
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}