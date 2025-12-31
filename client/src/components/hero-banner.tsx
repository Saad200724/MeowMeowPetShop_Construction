import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

const bannerImage = "/Banner_Reflex.webp";

interface Banner {
  _id: string;
  imageUrl: string;
  title?: string;
  order: number;
  isActive: boolean;
}

export default function HeroBanner() {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const { data: banners = [] } = useQuery<Banner[]>({
    queryKey: ['/api/banners/active'],
  });

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const displayBanners = banners.length > 0 ? banners : [{ imageUrl: bannerImage, title: 'Default Banner' }];
  const currentBanner = displayBanners[currentBannerIndex];

  return (
    <section className="w-full">
      <div className="hero-banner-wrapper relative">
        <div className="hero-banner-content">
          <img
            src={currentBanner.imageUrl}
            alt={currentBanner.title || "Meow Meow Pet Shop - Everything You Need"}
            loading="eager"
            className="w-full h-auto"
            onLoad={() => console.log("Banner loaded successfully")}
            onError={(e) => {
              console.error("Banner failed to load:", e);
              e.currentTarget.src = bannerImage;
            }}
          />
        </div>

        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
            {banners.map((_: Banner, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentBannerIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentBannerIndex ? 'bg-white w-8' : 'bg-white/50'
                }`}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Featured Categories Header */}
      <div className="bg-white py-4">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-purple-700 mb-2">
              FEATURED CATEGORIES
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}
