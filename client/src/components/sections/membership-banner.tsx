import { Button } from '@/components/ui/button';
import { Percent, Truck, Star } from 'lucide-react';
import logoPath from '@assets/logo_1753447667081.png';

export default function MembershipBanner() {
  return (
    <section className="py-12 bg-gradient-to-r from-purple-600 to-purple-800">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-4xl mx-auto shadow-2xl">
          <div className="flex items-center justify-center mb-6">
            <img src={logoPath} alt="Platinum Meow Club" className="h-16 w-16 mr-4" />
            <div>
              <h3 className="text-3xl font-bold text-meow-green">Platinum Meow Club</h3>
              <p className="text-gray-600">Exclusive Membership Program</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="meow-yellow w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Percent size={24} className="text-meow-green" />
              </div>
              <h4 className="font-bold text-meow-green">15% Discount</h4>
              <p className="text-sm text-gray-600">On all purchases</p>
            </div>
            <div className="text-center">
              <div className="meow-yellow w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Truck size={24} className="text-meow-green" />
              </div>
              <h4 className="font-bold text-meow-green">Free Delivery</h4>
              <p className="text-sm text-gray-600">On orders above ৳1000</p>
            </div>
            <div className="text-center">
              <div className="meow-yellow w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star size={24} className="text-meow-green" />
              </div>
              <h4 className="font-bold text-meow-green">Priority Support</h4>
              <p className="text-sm text-gray-600">24/7 dedicated support</p>
            </div>
          </div>
          
          <div className="meow-green text-white p-6 rounded-xl mb-6">
            <div className="text-4xl font-bold mb-2">৳5,000</div>
            <div className="text-lg">Lifetime Membership</div>
          </div>
          
          <Button className="meow-yellow text-black px-8 py-3 rounded-lg hover-meow-yellow font-semibold text-lg">
            Join Platinum Meow Club
          </Button>
        </div>
      </div>
    </section>
  );
}
