import { Button } from '@/components/ui/button';
import { Cat, Dog, ShoppingBag } from 'lucide-react';

export default function HeroBanner() {
  return (
    <section className="bg-[#fffbea] section-spacing text-center px-4 relative overflow-hidden">
      <div className="responsive-container relative z-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#26732d] mb-4 animate-fade-in">
          Welcome to Meow Meow Pet Shop
        </h1>
        <p className="text-base sm:text-lg text-gray-700 mb-6 flex flex-col sm:flex-row items-center justify-center gap-2 animate-slide-up">
          <span className="flex items-center gap-2">
            <Cat size={20} className="text-[#26732d]" />
            Premium Pet Food & Accessories in Savar
            <Dog size={20} className="text-[#26732d]" />
          </span>
        </p>
        <div className="bg-[#26732d] text-white px-4 sm:px-6 py-3 rounded-xl inline-block mb-6 animate-scale-up">
          <span className="text-lg sm:text-xl font-bold">5% OFF</span> your first order!
        </div>
        <div className="mt-6">
          <Button 
            variant="meowGreen" 
            size="lg" 
            className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg flex items-center gap-2 mx-auto btn-bounce"
          >
            <ShoppingBag size={20} />
            Shop Now
          </Button>
        </div>
      </div>
      
      {/* Pet silhouettes for decoration */}
      <div className="absolute left-10 bottom-10 opacity-10">
        <Cat size={120} className="text-[#26732d]" />
      </div>
      <div className="absolute right-10 top-10 opacity-10">
        <Dog size={120} className="text-[#26732d]" />
      </div>
    </section>
  );
}
