import { Button } from '@/components/ui/button';
import { Percent, Truck, Star } from 'lucide-react';
import { Link } from 'wouter';
const logoPath = '/logo.png';

export default function MembershipBanner() {
  return (
    <section className="py-6 bg-gradient-to-r from-purple-600 to-purple-800">
      <div className="responsive-container">
        <div className="bg-white rounded-2xl p-4 text-center max-w-3xl mx-auto shadow-2xl animate-scale-up">
          {/* Header Section - Compact */}
          <div className="flex items-center justify-center mb-3">
            <img src={logoPath} alt="Privilege Meow Club" className="h-8 w-8 mr-2" />
            <div>
              <h3 className="text-lg font-bold text-[#26732d]">Privilege Meow Club</h3>
              <p className="text-xs text-gray-600">Exclusive Membership Program</p>
            </div>
          </div>
          
          {/* Main Content - Compact Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 items-center">
            
            {/* Benefits - Compact Grid */}
            <div className="lg:col-span-3 flex justify-center gap-4">
              <div className="text-center animate-fade-in">
                <div className="bg-[#ffde59] w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-1 hover:scale-110 transition-transform duration-300">
                  <Percent size={16} className="text-[#26732d]" />
                </div>
                <h4 className="font-bold text-[#26732d] text-xs">15% Discount</h4>
                <p className="text-[10px] text-gray-600">On all purchases</p>
              </div>
              
              <div className="text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="bg-[#ffde59] w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-1 hover:scale-110 transition-transform duration-300">
                  <Truck size={16} className="text-[#26732d]" />
                </div>
                <h4 className="font-bold text-[#26732d] text-xs">Free Delivery</h4>
                <p className="text-[10px] text-gray-600">On orders above ৳1000</p>
              </div>
              
              <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="bg-[#ffde59] w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-1 hover:scale-110 transition-transform duration-300">
                  <Star size={16} className="text-[#26732d]" />
                </div>
                <h4 className="font-bold text-[#26732d] text-xs">Priority Support</h4>
                <p className="text-[10px] text-gray-600">24/7 dedicated support</p>
              </div>
            </div>
            
            {/* Price and CTA - Compact */}
            <div className="flex flex-col items-center gap-2">
              <div className="bg-[#26732d] text-white px-3 py-2 rounded-lg animate-scale-up text-center">
                <div className="text-lg font-bold">৳5,000</div>
                <div className="text-[10px]">Lifetime</div>
              </div>
              
              <Link href="/privilege-club">
                <Button 
                  variant="meow" 
                  size="sm" 
                  className="px-3 py-1 rounded-lg text-xs btn-bounce whitespace-nowrap"
                >
                  Join Club
                </Button>
              </Link>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
