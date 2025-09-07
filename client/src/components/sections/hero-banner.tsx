import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative bg-white py-4">
      {/* Banner Container with fixed 1200x400px dimensions */}
      <div className="container mx-auto px-4">
        <div className="relative w-full max-w-[1200px] mx-auto">
          <div className="relative w-full h-[400px] overflow-hidden rounded-xl shadow-md bg-gray-100">
            <img
              src="/Banner_Reflex.png"
              alt="Reflex High Quality - আর্ডার করলেই পেয়ে যাচ্ছেন আকর্ষণীয় GIFT - Shop Now"
              className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
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
