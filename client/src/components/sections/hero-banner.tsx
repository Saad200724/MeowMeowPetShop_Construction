import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Responsive Banner Image */}
      <div className="relative w-full">
        <div className="relative w-full h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px]">
          <img
            src="/Banner_Reflex.png"
            alt="Reflex High Quality - আর্ডার করলেই পেয়ে যাচ্ছেন আকর্ষণীয় GIFT - Shop Now"
            className="w-full h-full object-cover"
            loading="eager"
            onLoad={() => console.log("Banner loaded successfully")}
            onError={(e) => {
              console.error("Banner failed to load:", e);
              console.log("Trying fallback image path...");
              const target = e.currentTarget;
              target.src = "Banner_Reflex.webp";
            }}
          />
        </div>
      </div>
    </section>
  );
}
