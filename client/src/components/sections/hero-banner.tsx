
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Responsive Banner Image */}
      <div className="relative w-full">
        <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
          <img
            src="/Banner_Reflex.png"
            alt="Reflex High Quality - আর্ডার করলেই পেয়ে যাচ্ছেন আকর্ষণীয় GIFT - Shop Now"
            className="w-full h-full object-cover"
            loading="eager"
            onError={(e) => {
              // Show fallback content if image fails to load
              const target = e.currentTarget;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          
          {/* Fallback content - hidden by default */}
          <div className="w-full h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 items-center justify-center hidden">
            <div className="text-center text-white p-8">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                Special Offer!
              </h1>
              <p className="text-xl md:text-2xl mb-4 drop-shadow">
                Everything for Your Pet
              </p>
              <p className="text-lg md:text-xl font-bold drop-shadow">
                Up to 70% Off
              </p>
              <Button 
                variant="default" 
                size="lg"
                className="mt-6 bg-white text-orange-600 hover:bg-gray-100 font-bold px-8 py-3"
              >
                <ShoppingBag size={20} className="mr-2" />
                Shop Now
              </Button>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
