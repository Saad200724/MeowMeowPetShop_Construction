import { Button } from '@/components/ui/button';
import { Percent, Truck, Star } from 'lucide-react';
import { Link } from 'wouter';
const logoPath = '/logo.png';

export default function MembershipBanner() {
  return (
    <section className="py-8 sm:py-12 bg-gradient-to-r from-purple-600 to-purple-800">
      <div className="responsive-container">
        <div className="bg-white rounded-2xl p-4 sm:p-6 text-center max-w-5xl mx-auto shadow-2xl animate-scale-up">
          {/* Header Section - Compact */}
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4">
            <img src={logoPath} alt="Privilege Meow Club" className="h-10 w-10 sm:h-12 sm:w-12 sm:mr-3 mb-2 sm:mb-0" />
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#26732d]">Privilege Meow Club</h3>
              <p className="text-sm text-gray-600">Exclusive Membership Program</p>
            </div>
          </div>
          
          {/* Main Content - Responsive Layout */}
          <div className="flex flex-col xl:flex-row items-center justify-between gap-4 xl:gap-6">
            
            {/* Benefits - Horizontal on Desktop */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 flex-1">
              <div className="text-center animate-fade-in">
                <div className="bg-[#ffde59] w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mx-auto mb-2 hover:scale-110 transition-transform duration-300">
                  <Percent size={20} className="text-[#26732d]" />
                </div>
                <h4 className="font-bold text-[#26732d] text-sm">15% Discount</h4>
                <p className="text-xs text-gray-600">On all purchases</p>
              </div>
              
              <div className="text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="bg-[#ffde59] w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mx-auto mb-2 hover:scale-110 transition-transform duration-300">
                  <Truck size={20} className="text-[#26732d]" />
                </div>
                <h4 className="font-bold text-[#26732d] text-sm">Free Delivery</h4>
                <p className="text-xs text-gray-600">On orders above ৳1000</p>
              </div>
              
              <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="bg-[#ffde59] w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mx-auto mb-2 hover:scale-110 transition-transform duration-300">
                  <Star size={20} className="text-[#26732d]" />
                </div>
                <h4 className="font-bold text-[#26732d] text-sm">Priority Support</h4>
                <p className="text-xs text-gray-600">24/7 dedicated support</p>
              </div>
            </div>
            
            {/* Price and CTA - Compact */}
            <div className="flex flex-col lg:flex-row items-center gap-3 lg:gap-4 flex-shrink-0">
              <div className="bg-[#26732d] text-white px-4 py-3 sm:px-6 sm:py-4 rounded-xl animate-scale-up text-center">
                <div className="text-xl sm:text-2xl font-bold">৳5,000</div>
                <div className="text-xs sm:text-sm">Lifetime Membership</div>
              </div>
              
              <Link href="/privilege-club">
                <Button 
                  variant="meow" 
                  size="lg" 
                  className="px-3 sm:px-4 lg:px-6 py-2 lg:py-3 rounded-lg text-xs sm:text-sm lg:text-base btn-bounce whitespace-nowrap max-w-full overflow-hidden"
                >
                  Join Privilege Meow Club
                </Button>
              </Link>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
