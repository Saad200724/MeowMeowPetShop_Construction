import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await apiRequest('POST', '/api/newsletter', { email });
      toast({
        title: "Successfully subscribed! 🐾",
        description: "Thank you for subscribing to our newsletter.",
      });
      setEmail("");
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-primary-yellow to-yellow-400">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">Stay Pawsome! 🐾</h3>
          <p className="text-gray-700 mb-8">
            Get the latest updates on pet care tips, new products, and exclusive offers
          </p>
          
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSubscribe} className="flex">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-r-none border-r-0 focus:ring-2 focus:ring-accent-green"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-accent-green text-white hover:bg-green-700 font-semibold rounded-l-none px-6"
              >
                {isLoading ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
            <p className="text-sm text-gray-600 mt-3">* No spam, only pawsome content!</p>
          </div>
        </div>
      </div>
      
      {/* Decorative paw prints */}
      <div className="absolute opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 text-2xl text-gray-800">
          <i className="fas fa-paw"></i>
        </div>
        <div className="absolute bottom-10 right-10 text-2xl text-gray-800">
          <i className="fas fa-paw"></i>
        </div>
      </div>
    </section>
  );
}
