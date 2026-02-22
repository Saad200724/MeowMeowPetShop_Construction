import { useEffect } from 'react';
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


export default function Home() {
  const { isVisible: sidebarVisible } = useSidebar();

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
      <main className={`transition-all duration-300 ${sidebarVisible ? 'md:ml-80' : 'md:ml-0'} overflow-x-hidden pb-20 md:pb-0 px-0`}>
        <HeroBanner />
        <div className="px-0 md:px-4 lg:px-6 space-y-8 md:space-y-12">
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