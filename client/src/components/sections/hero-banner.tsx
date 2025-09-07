import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative bg-white py-4">
      {/* Banner Container with proper spacing and styling */}
      <div className="container mx-auto px-4">
        <div className="relative w-full">
          <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] overflow-hidden rounded-xl shadow-md">
            <img
              src="/Banner_Reflex.png"
              alt="Reflex High Quality - আর্ডার করলেই পেয়ে যাচ্ছেন আকর্ষণীয় GIFT - Shop Now"
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              loading="eager"
              onLoad={() => console.log("Banner loaded successfully")}
              onError={(e) => {
                console.error("Banner failed to load:", e);
                console.log("Trying fallback image path...");
                const target = e.currentTarget;
                target.src = "/Banner_Reflex.webp";
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
