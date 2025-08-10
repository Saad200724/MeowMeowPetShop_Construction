
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Sidebar from "@/components/layout/sidebar";
import HeroBanner from "@/components/sections/hero-banner";
import CategoriesGrid from "@/components/sections/categories-grid";
import FeaturedCategories from "@/components/sections/featured-categories";
import FlashSale from "@/components/sections/flash-sale";
import BestsellersCats from "@/components/sections/bestsellers-cats";
import BestsellersDogs from "@/components/sections/bestsellers-dogs";
import RepackFood from "@/components/sections/repack-food";
import FeaturedBrands from "@/components/sections/featured-brands";
import NewlyLaunched from "@/components/sections/newly-launched";
import MembershipBanner from "@/components/sections/membership-banner";
import BlogPreview from "@/components/sections/blog-preview";
import Testimonials from "@/components/sections/testimonials";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        
        <main className="flex-1 w-full lg:w-auto">
          <div className="space-y-8 md:space-y-12">
            <HeroBanner />
            <div className="px-4 lg:px-6">
              <CategoriesGrid />
              <FeaturedCategories />
              <FlashSale />
              <BestsellersCats />
              <BestsellersDogs />
              <RepackFood />
              <FeaturedBrands />
              <NewlyLaunched />
              <MembershipBanner />
              <BlogPreview />
              <Testimonials />
            </div>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}
