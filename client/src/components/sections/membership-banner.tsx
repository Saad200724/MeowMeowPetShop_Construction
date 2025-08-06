import { Button } from '@/components/ui/button';
import { Percent, Truck, Star } from 'lucide-react';
const logoPath = '/logo.png';

export default function MembershipBanner() {
  return (
    <section className="section-spacing bg-gradient-to-r from-purple-600 to-purple-800">
      <div className="responsive-container">
        <div className="bg-white rounded-2xl p-6 sm:p-8 text-center max-w-4xl mx-auto shadow-2xl animate-scale-up">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-6">
            <img src={logoPath} alt="Privilege Meow Club" className="h-12 w-12 sm:h-16 sm:w-16 sm:mr-4 mb-3 sm:mb-0" />
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#26732d]">Privilege Meow Club</h3>
              <p className="text-gray-600">Exclusive Membership Program</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="text-center animate-fade-in">
              <div className="bg-[#ffde59] w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 hover:scale-110 transition-transform duration-300">
                <Percent size={24} className="text-[#26732d]" />
              </div>
              <h4 className="font-bold text-[#26732d]">15% Discount</h4>
              <p className="text-sm text-gray-600">On all purchases</p>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="bg-[#ffde59] w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 hover:scale-110 transition-transform duration-300">
                <Truck size={24} className="text-[#26732d]" />
              </div>
              <h4 className="font-bold text-[#26732d]">Free Delivery</h4>
              <p className="text-sm text-gray-600">On orders above ৳1000</p>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="bg-[#ffde59] w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 hover:scale-110 transition-transform duration-300">
                <Star size={24} className="text-[#26732d]" />
              </div>
              <h4 className="font-bold text-[#26732d]">Priority Support</h4>
              <p className="text-sm text-gray-600">24/7 dedicated support</p>
            </div>
          </div>
          
          <div className="bg-[#26732d] text-white p-6 rounded-xl mb-6 animate-scale-up">
            <div className="text-3xl sm:text-4xl font-bold mb-2">৳5,000</div>
            <div className="text-base sm:text-lg">Lifetime Membership</div>
          </div>
          
          <Button 
            variant="meow" 
            size="lg" 
            className="px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg btn-bounce"
          >
            Join Privilege Meow Club
          </Button>
        </div>
      </div>
    </section>
  );
}
