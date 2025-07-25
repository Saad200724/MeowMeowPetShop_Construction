import { Button } from '@/components/ui/button';
import { Cat, Dog, ShoppingBag } from 'lucide-react';

export default function HeroBanner() {
  return (
    <section className="bg-[#fffbea] py-16 text-center px-4 relative overflow-hidden">
      <div className="container mx-auto relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-[#26732d] mb-4">
          Welcome to Meow Meow Pet Shop
        </h1>
        <p className="text-lg text-gray-700 mb-6 flex items-center justify-center gap-2">
          <Cat size={20} className="text-[#26732d]" />
          Premium Pet Food & Accessories in Savar
          <Dog size={20} className="text-[#26732d]" />
        </p>
        <div className="bg-[#26732d] text-white px-6 py-3 rounded-xl inline-block mb-6">
          <span className="text-xl font-bold">5% OFF</span> your first order!
        </div>
        <br />
        <Button className="bg-[#26732d] text-white px-8 py-4 rounded-xl hover:bg-[#1e5d26] transition-all duration-300 font-semibold text-lg flex items-center gap-2">
          <ShoppingBag size={20} />
          Shop Now
        </Button>
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
