import {
  Cat,
  Dog,
  Heart,
  Gift,
  ShoppingBag,
  Pill,
  Shield,
  Glasses,
  Shirt,
} from "lucide-react";
import { Link } from "wouter";

export default function CategoriesGrid() {
  const categories = [
    {
      id: "adult-food",
      name: "Adult Food",
      icon: Cat,
      image:
        "https://media.mewmewshopbd.com/uploads/media-manager/2025/05/adult-food-2-1747499026.png",
      count: "Premium Quality",
      color: "bg-purple-100 text-purple-600",
    },
    {
      id: "kitten-food",
      name: "Kitten Food",
      icon: Cat,
      image:
        "https://media.mewmewshopbd.com/uploads/media-manager/2025/05/kitten-food-2-1747508016.png",
      count: "Growing Nutrition",
      color: "bg-pink-100 text-pink-600",
    },
    {
      id: "collar",
      name: "Collar",
      icon: Shirt,
      image:
        "https://media.mewmewshopbd.com/uploads/media-manager/2025/05/collar-1747508281.png",
      count: "Style & Safety",
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: "clumping-cat-litter",
      name: "Clumping Cat Litter",
      icon: Gift,
      image: "https://mewmewshopbd.com/uploads/category/2024/1718325625.png",
      count: "Easy Clean",
      color: "bg-gray-100 text-gray-600",
    },
    {
      id: "cat-litter-accessories",
      name: "Cat Litter Accessories",
      icon: Heart,
      image:
        "https://media.mewmewshopbd.com/uploads/media-manager/2025/05/cat-litter-accessaries-1747508179.png",
      count: "Complete Care",
      color: "bg-cyan-100 text-cyan-600",
    },
    {
      id: "harness",
      name: "Harness",
      icon: Shield,
      image:
        "https://media.mewmewshopbd.com/uploads/media-manager/2025/05/harness-2-1747508347.png",
      count: "Secure Walking",
      color: "bg-red-100 text-red-600",
    },
    {
      id: "cat-tick-flea-control",
      name: "Cat Tick & Flea Control",
      icon: Pill,
      image:
        "https://media.mewmewshopbd.com/uploads/media-manager/2025/05/cat-tick-and-flea-control-1747508541.png",
      count: "Health Protection",
      color: "bg-green-100 text-green-600",
    },
    {
      id: "deworming-tablet",
      name: "Deworming Tablet",
      icon: Pill,
      image: "https://mewmewshopbd.com/uploads/category/2024/1719451524.png",
      count: "Wellness Care",
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      id: "cat-pouches",
      name: "Cat Pouches",
      icon: Gift,
      image:
        "https://media.mewmewshopbd.com/uploads/media-manager/2025/05/pouches-1-1747508038.png",
      count: "Wet Food",
      color: "bg-orange-100 text-orange-600",
    },
    {
      id: "sunglass",
      name: "Sunglass",
      icon: Glasses,
      image:
        "https://media.mewmewshopbd.com/uploads/media-manager/2025/05/sunglass-1747508365.png",
      count: "Pet Fashion",
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  return (
    <section className="section-spacing bg-white">
      <div className="responsive-container">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-lg md:text-3xl font-bold text-center text-[#26732d] flex items-center justify-center gap-2 animate-fade-in">
            <ShoppingBag size={20} className="text-[#26732d] md:w-8 md:h-8" />
            SHOP BY CATEGORY
          </h2>
        </div>

        {/* Categories Grid */}
        {/* Mobile/Tablet view: Show first 9 categories in 3 columns (3 rows × 3 columns) */}
        <div className="grid grid-cols-3 gap-4 md:hidden px-4">
          {categories.slice(0, 9).map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={category.id}
                href={`/products?subcategory=${category.id}`}
                className="group cursor-pointer hover-lift animate-fade-in block"
                style={
                  { animationDelay: `${index * 0.1}s` } as React.CSSProperties
                }
                data-testid={`link-category-${category.id}`}
              >
                <div className="bg-white rounded-xl shadow-lg overflow-hidden h-44 flex flex-col">
                  <div className="relative overflow-hidden bg-gray-50 p-4 flex-1 flex items-center justify-center">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 max-h-20"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-3 text-center bg-white">
                    <h3 className="text-sm font-bold text-gray-800 leading-tight">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Desktop/Laptop view: Show all 10 categories */}
        <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={category.id}
                href={`/products?subcategory=${category.id}`}
                className="group cursor-pointer hover-lift animate-fade-in block"
                style={
                  { animationDelay: `${index * 0.1}s` } as React.CSSProperties
                }
                data-testid={`link-category-${category.id}`}
              >
                <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col">
                  <div className="relative overflow-hidden bg-gray-50 rounded-t-xl p-4 h-32 sm:h-40 md:h-48 flex-shrink-0">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-3 sm:p-4 text-center flex-grow flex flex-col justify-center min-h-[80px]">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-800 mb-1 leading-tight">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {category.count}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
