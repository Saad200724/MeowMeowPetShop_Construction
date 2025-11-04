import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface Banner {
  _id: string;
  imageUrl: string;
  title?: string;
  order: number;
  isActive: boolean;
}

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const { data: banners = [], isLoading } = useQuery<Banner[]>({
    queryKey: ['/api/banners/active'],
  });

  // Reset slide to 0 if current slide is out of bounds
  useEffect(() => {
    if (banners.length > 0 && currentSlide >= banners.length) {
      setCurrentSlide(0);
    }
  }, [banners.length, currentSlide]);

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (banners.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Show fallback banner if no banners in database
  if (!isLoading && banners.length === 0) {
    return (
      <section className="hero-banner-wrapper">
        <div className="hero-banner-content">
          <img
            src="/Banner_Reflex.png"
            alt="Reflex High Quality - আর্ডার করলেই পেয়ে যাচ্ছেন আকর্ষণীয় GIFT - Shop Now"
            loading="eager"
            onError={(e) => {
              const target = e.currentTarget;
              target.src = "/Banner_Reflex.webp";
            }}
            data-testid="img-banner-fallback"
          />
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="hero-banner-wrapper">
        <div className="hero-banner-content bg-gray-200 animate-pulse">
          <div className="w-full h-[400px]" />
        </div>
      </section>
    );
  }

  return (
    <section className="hero-banner-wrapper relative">
      <div className="hero-banner-content relative overflow-hidden">
        {/* Banner Images */}
        <div className="relative">
          {banners.map((banner, index) => (
            <div
              key={banner._id}
              className={`transition-opacity duration-500 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0 absolute inset-0'
              }`}
              data-testid={`banner-slide-${index}`}
            >
              <img
                src={banner.imageUrl}
                alt={banner.title || `Banner ${index + 1}`}
                loading={index === 0 ? 'eager' : 'lazy'}
                className="w-full h-auto object-cover"
                data-testid={`img-banner-${banner._id}`}
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows (only show if multiple banners) */}
        {banners.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/95 rounded-full shadow-lg"
              onClick={prevSlide}
              data-testid="button-banner-prev"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/95 rounded-full shadow-lg"
              onClick={nextSlide}
              data-testid="button-banner-next"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </Button>
          </>
        )}

        {/* Dots Indicator (only show if multiple banners) */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide
                    ? 'bg-white w-8'
                    : 'bg-white/60 hover:bg-white/80'
                }`}
                onClick={() => goToSlide(index)}
                data-testid={`button-banner-dot-${index}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
