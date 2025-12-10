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

  const { data: rawBanners = [], isLoading } = useQuery<Banner[]>({
    queryKey: ['/api/banners/active'],
  });

  // Sort banners by order field to ensure correct sequence
  const banners = [...rawBanners].sort((a, b) => a.order - b.order);

  // Debug: Log banners data
  useEffect(() => {
    console.log('Active banners loaded:', banners.length);
    if (banners.length > 0) {
      console.log('Banners:', banners.map(b => ({ title: b.title, order: b.order, url: b.imageUrl })));
    } else {
      console.log('No active banners found, will show fallback banner');
    }
  }, [banners]);

  // Reset slide to 0 if current slide is out of bounds
  useEffect(() => {
    if (banners.length > 0 && currentSlide >= banners.length) {
      setCurrentSlide(0);
    }
  }, [banners.length, currentSlide]);

  // Auto-advance carousel every 5 seconds (works for all banner counts)
  useEffect(() => {
    if (banners.length === 0) return;

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

  if (isLoading) {
    return (
      <section className="hero-banner-wrapper">
        <div className="hero-banner-content bg-gray-200 animate-pulse">
          <div className="w-full h-[400px]" />
        </div>
      </section>
    );
  }

  // Show fallback banner if no banners in database
  if (banners.length === 0) {
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

  return (
    <section className="hero-banner-wrapper relative w-full">
      <div className="hero-banner-content relative overflow-hidden w-full">
        {/* Banner Images - 1200:400 aspect ratio */}
        <div className="relative w-full" style={{ paddingBottom: '33.33%' }}>
          {banners.map((banner, index) => (
            <div
              key={banner._id}
              className={`transition-opacity duration-500 absolute top-0 left-0 w-full h-full ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
              data-testid={`banner-slide-${index}`}
            >
              <img
                src={banner.imageUrl}
                alt={banner.title || `Banner ${index + 1}`}
                loading={index === 0 ? 'eager' : 'lazy'}
                className="absolute top-0 left-0 w-full h-full object-cover"
                data-testid={`img-banner-${banner._id}`}
                onError={(e) => {
                  console.error('Failed to load banner:', banner.imageUrl);
                }}
              />
            </div>
          ))}
        </div>

        {/* Dots Indicator (always show if there are banners) */}
        {banners.length > 0 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`h-1 rounded-full transition-all ${
                  index === currentSlide
                    ? 'bg-white w-6'
                    : 'bg-white/60 hover:bg-white/80 w-1'
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