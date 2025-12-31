import { useEffect } from 'react';
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import NavigationSidebar from "@/components/layout/sidebar";
import { useSidebar } from "@/contexts/sidebar-context";
import { Heart, Award, Truck, Shield, Users, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { setSEO, seoMetadata } from "@/lib/seo";

export default function AboutPage() {
  const { isVisible: sidebarVisible } = useSidebar();

  useEffect(() => {
    setSEO({
      ...seoMetadata.about,
      canonical: 'https://meowmeowpetshop.com/about',
    });
  }, []);

  const values = [
    {
      icon: Heart,
      title: "Pet-First Approach",
      description: "Every decision we make is centered around the health and happiness of your beloved pets."
    },
    {
      icon: Award,
      title: "Quality Assurance",
      description: "We source only premium products from trusted brands to ensure your pets get the best nutrition and care."
    },
    {
      icon: Truck,
      title: "Fast & Reliable",
      description: "Quick delivery across Savar and Dhaka to ensure your pets never run out of their essentials."
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "Secure payment methods and genuine products you can trust for your furry family members."
    }
  ];

  const stats = [
    { number: "5000+", label: "Happy Customers" },
    { number: "10000+", label: "Products Sold" },
    { number: "50+", label: "Premium Brands" },
    { number: "24/7", label: "Customer Support" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <NavigationSidebar />

      <main className={`transition-all duration-300 ${sidebarVisible ? 'md:ml-80' : 'md:ml-0'} pb-20 md:pb-0`}>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#26732d] to-[#38603d] text-white py-12 md:py-20">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">About Meow Meow Pet Shop</h1>
            <p className="text-lg md:text-xl text-gray-100 leading-relaxed">
              Your Trusted Partner for Premium Pet Care in Savar, Bangladesh
            </p>
          </div>
        </div>

        {/* Our Story Section */}
        <div className="container mx-auto px-4 py-12 md:py-16 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Meow Meow Pet Shop was founded with a simple yet powerful mission: to provide pet owners in Savar and across Bangladesh with access to premium quality pet food, accessories, and care products.
                </p>
                <p>
                  We understand that pets are not just animals—they're family members who deserve the best care possible. That's why we've carefully curated a selection of products from the world's most trusted brands, ensuring that every item we sell meets our high standards of quality and safety.
                </p>
                <p>
                  Located at Pakiza Bus Stand in Savar, we've been serving the local community with dedication and passion. Our team of pet care enthusiasts is always ready to help you find the perfect products for your furry, feathered, or scaled friends.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="/logo.png"
                alt="Meow Meow Pet Shop"
                className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-[#ffde59] text-[#26732d] p-6 rounded-lg shadow-lg hidden md:block">
                <div className="flex items-center gap-2">
                  <Star className="fill-current" size={24} />
                  <div>
                    <div className="text-2xl font-bold">5.0</div>
                    <div className="text-sm">Customer Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gray-50 py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-[#26732d] mb-2">{stat.number}</div>
                  <div className="text-sm md:text-base text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className="container mx-auto px-4 py-12 md:py-16 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-[#26732d] shadow-lg">
              <CardContent className="p-6 md:p-8">
                <div className="w-16 h-16 bg-[#26732d] rounded-full flex items-center justify-center mb-4">
                  <Heart className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-700 leading-relaxed">
                  To provide pet owners across Bangladesh with easy access to premium quality pet products at competitive prices, while delivering exceptional customer service and expert advice to ensure the health and happiness of every pet.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#ffde59] shadow-lg">
              <CardContent className="p-6 md:p-8">
                <div className="w-16 h-16 bg-[#ffde59] rounded-full flex items-center justify-center mb-4">
                  <Star className="text-[#26732d] fill-current" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-700 leading-relaxed">
                  To become Bangladesh's most trusted and beloved pet care destination, known for our commitment to quality, customer satisfaction, and making pet ownership a joyful and rewarding experience for everyone.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Our Values Section */}
        <div className="bg-gradient-to-b from-white to-gray-50 py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8 md:mb-12">
              What Sets Us Apart
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#26732d] to-[#38603d] rounded-full flex items-center justify-center mx-auto mb-4">
                      <value.icon className="text-white" size={28} />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">{value.title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* What We Offer Section */}
        <div className="container mx-auto px-4 py-12 md:py-16 max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8 md:mb-12">
            What We Offer
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border-2 border-gray-100 hover:border-[#26732d] transition-colors">
              <h4 className="font-bold text-lg text-[#26732d] mb-3">Premium Pet Food</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                High-quality nutrition for cats, dogs, rabbits, and birds from trusted international brands like Royal Canin, Reflex, Nekko, and more.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border-2 border-gray-100 hover:border-[#26732d] transition-colors">
              <h4 className="font-bold text-lg text-[#26732d] mb-3">Toys & Accessories</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Fun and engaging toys, comfortable beds, stylish collars, and essential accessories to keep your pets happy and healthy.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border-2 border-gray-100 hover:border-[#26732d] transition-colors">
              <h4 className="font-bold text-lg text-[#26732d] mb-3">Health & Care Products</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Grooming supplies, tick & flea control, deworming tablets, and other health essentials to maintain your pet's wellbeing.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border-2 border-gray-100 hover:border-[#26732d] transition-colors">
              <h4 className="font-bold text-lg text-[#26732d] mb-3">Cat Litter Solutions</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Premium clumping and non-clumping cat litter options with accessories to keep your home clean and odor-free.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border-2 border-gray-100 hover:border-[#26732d] transition-colors">
              <h4 className="font-bold text-lg text-[#26732d] mb-3">Bulk & Repack Options</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Cost-effective bulk purchases and convenient repack sizes to suit your budget and storage needs.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border-2 border-gray-100 hover:border-[#26732d] transition-colors">
              <h4 className="font-bold text-lg text-[#26732d] mb-3">Expert Advice</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Free consultation and personalized recommendations from our experienced team to help you choose the best products for your pets.
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA Section */}
        <div className="bg-[#26732d] text-white py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <Users size={48} className="mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Join Our Pet-Loving Community</h2>
            <p className="text-lg mb-6 text-gray-100">
              Visit us at our store in Savar or shop online for convenient home delivery across Bangladesh.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="bg-[#ffde59] text-[#26732d] px-8 py-3 rounded-lg font-semibold hover:bg-[#ffd73e] transition-colors">
                Visit Our Store
              </a>
              <a href="/" className="bg-white text-[#26732d] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Shop Now
              </a>
            </div>
            <div className="mt-8 text-sm text-gray-200">
              <p>📍 Pakiza Bus Stand, Chapra Mosjid Road, Savar, Dhaka</p>
              <p>📞 01405-045023 | 📧 meowmeowpetshop1@gmail.com</p>
              <p>🕐 Open Daily: 9 AM - 9 PM</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}