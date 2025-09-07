import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative bg-white py-4">
      {/* Full-width Banner Container */}
      <div className="px-4">
        <div className="relative w-full h-[400px] overflow-hidden rounded-xl">
          <img
            src="/Banner_Reflex.png"
            alt="Reflex High Quality - আর্ডার করলেই পেয়ে যাচ্ছেন আকর্ষণীয় GIFT - Shop Now"
            className="w-full h-full object-cover rounded-xl"
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
    </section>
  );
}
