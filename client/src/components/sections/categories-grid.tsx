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
  Gem,
  Package,
  Gamepad2,
} from "lucide-react";
import { Link } from "wouter";

export default function CategoriesGrid() {
  const categories = [
    {
      id: "kitten-dry-food",
      name: "Kitten Dry Food",
      icon: Cat,
      image: "https://media.mewmewshopbd.com/uploads/media-manager/2025/05/kitten-food-2-1747508016.png",
      count: "Premium Quality",
      color: "bg-purple-100 text-purple-600",
    },
    {
      id: "adult-dry-food",
      name: "Adult Dry Food",
      icon: Cat,
      image: "https://media.mewmewshopbd.com/uploads/media-manager/2025/05/adult-food-2-1747499026.png",
      count: "Growing Nutrition",
      color: "bg-pink-100 text-pink-600",
    },
    {
      id: "kitten-wet-food",
      name: "Kitten Wet Food",
      icon: Cat,
      image: "https://media.mewmewshopbd.com/uploads/media-manager/2025/05/pouches-1-1747508038.png",
      count: "Tasty & Nutritious",
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: "adult-wet-food",
      name: "Adult Wet Food",
      icon: Cat,
      image: "https://media.mewmewshopbd.com/uploads/media-manager/2025/05/pouches-1-1747508038.png",
      count: "Premium Quality",
      color: "bg-orange-100 text-orange-600",
    },
    {
      id: "litter-box",
      name: "Litter Box",
      icon: Package,
      image: "https://mewmewshopbd.com/uploads/category/2024/1718325625.png",
      count: "Easy Clean",
      color: "bg-gray-100 text-gray-600",
    },
    {
      id: "accessories",
      name: "Accessories",
      icon: Gem,
      image: "https://media.mewmewshopbd.com/uploads/media-manager/2025/05/collar-1747508281.png",
      count: "Style & Safety",
      color: "bg-cyan-100 text-cyan-600",
    },
    {
      id: "medicine",
      name: "Medicine",
      icon: Pill,
      image: "https://media.mewmewshopbd.com/uploads/media-manager/2025/05/cat-tick-and-flea-control-1747508541.png",
      count: "Health Protection",
      color: "bg-red-100 text-red-600",
    },
    {
      id: "toys",
      name: "Toys",
      icon: Gamepad2,
      image: "https://media.mewmewshopbd.com/uploads/media-manager/2025/05/kitten-food-2-1747508016.png",
      count: "Fun & Active",
      color: "bg-green-100 text-green-600",
    },
    {
      id: "shampoo",
      name: "Shampoo",
      icon: ShoppingBag,
      image: "https://media.mewmewshopbd.com/uploads/media-manager/2025/05/cat-litter-accessaries-1747508179.png",
      count: "Wellness Care",
      color: "bg-emerald-100 text-emerald-600",
    },
  ];

  return (
    <section className="section-spacing bg-gradient-to-b from-gray-50 to-white">
      <div className="responsive-container">
        {/* Header - Professional and Eye-catching */}
        <div className="mb-6 md:mb-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center gap-2 mb-2">
              <div className="h-1 w-8 bg-[#26732d] rounded-full"></div>
              <ShoppingBag className="text-[#26732d] w-6 h-6 md:w-8 md:h-8" />
              <div className="h-1 w-8 bg-[#26732d] rounded-full"></div>
            </div>
            <h2 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
              SHOP BY CATEGORY
            </h2>
            <p className="text-sm md:text-base text-gray-600 mt-2">
              Browse our premium collection for your beloved pets
            </p>
          </div>
        </div>

        {/* Categories Grid - Mobile/Tablet view */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 md:hidden px-2">
          {categories.slice(0, 9).map((category, index) => {
            return (
              <Link
                key={category.id}
                href={`/products?subcategory=${category.id}`}
                className="group cursor-pointer block animate-fade-in"
                style={
                  { animationDelay: `${index * 0.05}s` } as React.CSSProperties
                }
                data-testid={`link-category-${category.id}`}
              >
                <div className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                  {/* Image Container with Professional Background */}
                  <div className="relative bg-gradient-to-br from-gray-50 to-white p-4 flex items-center justify-center aspect-square overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-sm"
                      loading="lazy"
                      decoding="async"
                    />
                    {/* Subtle overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#26732d]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Text Container - Enhanced for Readability */}
                  <div className="px-2 py-3 text-center bg-white border-t border-gray-50">
                    <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 min-h-[2.5rem] flex items-center justify-center px-1">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Desktop/Laptop view - All categories with enhanced design */}
        <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-5 gap-5 lg:gap-6">
          {categories.map((category, index) => {
            return (
              <Link
                key={category.id}
                href={`/products?subcategory=${category.id}`}
                className="group cursor-pointer block animate-fade-in"
                style={
                  { animationDelay: `${index * 0.05}s` } as React.CSSProperties
                }
                data-testid={`link-category-${category.id}`}
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
                  {/* Image Container */}
                  <div className="relative bg-gradient-to-br from-gray-50 to-white p-6 flex items-center justify-center h-48 lg:h-56 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-md"
                      loading="lazy"
                      decoding="async"
                    />
                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#26732d]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Text Container - Professional Typography */}
                  <div className="px-4 py-5 text-center bg-white border-t border-gray-50 flex-grow flex flex-col justify-center">
                    <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-[#26732d] transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-xs lg:text-sm text-gray-600 font-medium">
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
