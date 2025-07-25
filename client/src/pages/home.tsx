import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import HeroBanner from "@/components/hero-banner";
import FeaturedCategories from "@/components/featured-categories";
import ProductGrid from "@/components/product-grid";
import WhyChooseUs from "@/components/why-choose-us";
import CustomerReviews from "@/components/customer-reviews";
import Newsletter from "@/components/newsletter";
import Footer from "@/components/footer";
import { CartProvider } from "@/hooks/use-cart";
import type { Product } from "@shared/schema";

export default function Home() {
  const { data: flashSaleProducts = [], isLoading: flashSaleLoading } = useQuery<Product[]>({
    queryKey: ['/api/products/flash-sale'],
  });

  const { data: bestSellerProducts = [], isLoading: bestSellerLoading } = useQuery<Product[]>({
    queryKey: ['/api/products/best-sellers'],
  });

  const { data: allProducts = [], isLoading: allProductsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <HeroBanner />
          <FeaturedCategories />
          
          {/* Flash Sale Section */}
          <ProductGrid 
            title="Flash Sale"
            bgColor="bg-purple-50"
            products={flashSaleProducts}
            isLoading={flashSaleLoading}
          />

          {/* Featured Products Section - Light Pink */}
          <ProductGrid 
            bgColor="bg-pink-50"
            products={allProducts.slice(0, 6)}
            isLoading={allProductsLoading}
          />

          {/* Best Sellers Section - Light Blue */}
          <ProductGrid 
            bgColor="bg-blue-50"
            products={bestSellerProducts}
            isLoading={bestSellerLoading}
          />

          {/* More Products Section - Light Green */}
          <ProductGrid 
            bgColor="bg-green-50"
            products={allProducts.slice(6, 12)}
            isLoading={allProductsLoading}
          />

          {/* Additional Products Section - Light Yellow */}
          <ProductGrid 
            bgColor="bg-yellow-50"
            products={allProducts.slice(12, 18)}
            isLoading={allProductsLoading}
          />

          {/* Cat Food Section - Light Purple */}
          <ProductGrid 
            bgColor="bg-purple-50"
            products={allProducts.slice(18, 24)}
            isLoading={allProductsLoading}
          />

          <WhyChooseUs />
          <CustomerReviews />
          <Newsletter />
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
