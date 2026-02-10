import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { setSEO, seoMetadata } from '@/lib/seo';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import NavigationSidebar from "@/components/layout/sidebar";
import HeroBanner from "@/components/sections/hero-banner";
import CategoriesGrid from "@/components/sections/categories-grid";
import FlashSale from "@/components/sections/flash-sale";
import BestsellersCats from "@/components/sections/bestsellers-cats";
import BestsellersDogs from "@/components/sections/bestsellers-dogs";
import RepackFood from "@/components/sections/repack-food";
import FeaturedBrands from "@/components/sections/featured-brands";
import NewlyLaunched from "@/components/sections/newly-launched";
import MembershipBanner from "@/components/sections/membership-banner";
import BlogPreview from "@/components/sections/blog-preview";
import Testimonials from "@/components/sections/testimonials";
import { useSidebar } from "@/contexts/sidebar-context";
import { X } from "lucide-react";


export default function Home() {
  const { isVisible: sidebarVisible } = useSidebar();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Show popup after 2 seconds if not seen in this session
    const hasSeenPopup = sessionStorage.getItem("hasSeenPopup");
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setShowPopup(true);
        sessionStorage.setItem("hasSeenPopup", "true");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    setSEO({
      ...seoMetadata.home,
      ogUrl: 'https://meowshopbd.me',
      ogImage: 'https://meowshopbd.me/logo.png',
      canonical: 'https://meowshopbd.me',
    });
  }, []);


  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Fixed Sidebar */}
      <NavigationSidebar />

      {/* Main content - adjusted for desktop sidebar and mobile bottom nav */}
      <main className={`transition-all duration-300 ${sidebarVisible ? 'md:ml-80' : 'md:ml-0'} overflow-x-hidden pb-20 md:pb-0`}>
        <HeroBanner />
        
        {/* 1:1 Aspect Ratio Popup Banner */}
        {showPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-[400px] aspect-square bg-white rounded-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
              <button 
                onClick={() => setShowPopup(false)}
                className="absolute top-2 right-2 z-10 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                data-testid="button-close-popup"
              >
                <X className="h-5 w-5" />
              </button>
              <img 
                src="/Popup_Banner.png" 
                alt="Special Offer" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.src = "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800&auto=format&fit=crop";
                }}
                data-testid="img-popup-banner"
              />
            </div>
          </div>
        )}

        <div className="px-4 lg:px-6 space-y-8 md:space-y-12">
          <FlashSale />
          <CategoriesGrid />
          <BestsellersCats />
          <BestsellersDogs />
          <RepackFood />
          <FeaturedBrands />
          <NewlyLaunched />
          {/* <MembershipBanner /> */}
          <BlogPreview />
          <Testimonials />
        </div>
      </main>

      {/* Footer - Full width, overlays sidebar */}
      <div className="relative z-30 w-full">
        <Footer />
      </div>

      {/* Mobile Bottom Navigation */}
      {/* This component is now globally available in the App component */}
    </div>
  );
}