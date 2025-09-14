import { Button } from '@/components/ui/button';
import { Percent, Truck, Star } from 'lucide-react';
import { Link } from 'wouter';
const logoPath = '/logo.png';

export default function MembershipBanner() {
  return (
    <section className="py-6 bg-gradient-to-r from-purple-600 to-purple-800">
      <div className="responsive-container">
        <div className="bg-white rounded-2xl p-4 text-center max-w-3xl mx-auto shadow-2xl animate-scale-up">
          {/* Header Section - Big Title */}
          <div className="flex flex-col items-center justify-center mb-4">
            <div className="flex items-center justify-center mb-2">
              <img src={logoPath} alt="Privilege Meow Club" className="h-10 w-10 mr-3" />
              <h3 className="text-2xl md:text-3xl font-bold text-[#26732d]">Privilege Meow Club</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Exclusive Membership Program</p>
          </div>
          
          {/* Benefits Section - Smaller */}
          <div className="flex justify-center gap-6 mb-4">
            <div className="text-center animate-fade-in">
              <div className="bg-[#ffde59] w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 hover:scale-110 transition-transform duration-300">
                <Percent size={14} className="text-[#26732d]" />
              </div>
              <h4 className="font-bold text-[#26732d] text-[11px]">15% Discount</h4>
              <p className="text-[9px] text-gray-600">On all purchases</p>
            </div>
            
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="bg-[#ffde59] w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 hover:scale-110 transition-transform duration-300">
                <Truck size={14} className="text-[#26732d]" />
              </div>
              <h4 className="font-bold text-[#26732d] text-[11px]">Free Delivery</h4>
              <p className="text-[9px] text-gray-600">On orders above ৳1000</p>
            </div>
            
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="bg-[#ffde59] w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 hover:scale-110 transition-transform duration-300">
                <Star size={14} className="text-[#26732d]" />
              </div>
              <h4 className="font-bold text-[#26732d] text-[11px]">Priority Support</h4>
              <p className="text-[9px] text-gray-600">24/7 dedicated support</p>
            </div>
          </div>
          
          {/* Price and Button Side by Side */}
          <div className="flex items-center justify-center gap-6">
            {/* Price - Left Side */}
            <div className="bg-[#26732d] text-white px-4 py-3 rounded-lg animate-scale-up text-center">
              <div className="text-xl font-bold">৳5,000</div>
              <div className="text-xs">Lifetime</div>
            </div>
            
            {/* Button - Right Side */}
            <Link href="/privilege-club">
              <Button 
                variant="meow" 
                size="lg" 
                className="px-6 py-3 rounded-lg text-sm btn-bounce whitespace-nowrap"
              >
                Join Club
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
