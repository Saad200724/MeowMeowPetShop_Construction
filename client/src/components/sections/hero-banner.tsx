import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="hero-banner-wrapper">
      <div className="hero-banner-content">
        <img
          src="/Banner_Reflex.png"
          alt="Reflex High Quality - আর্ডার করলেই পেয়ে যাচ্ছেন আকর্ষণীয় GIFT - Shop Now"
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
    </section>
  );
}
