import { Link } from "wouter";
import { Award } from "lucide-react";

export default function FeaturedBrands() {
  const brands = [
    {
      name: "NEKKO",
      slug: "nekko",
      logo: "https://mewmewshopbd.com/uploads/brand/2024/1719452121.svg",
    },
    {
      name: "PURINA",
      slug: "purina",
      logo: "https://mewmewshopbd.com/uploads/brand/2024/1719452544.png",
    },
    {
      name: "ONE",
      slug: "one",
      logo: "https://mewmewshopbd.com/uploads/brand/2024/1719452560.svg",
    },
    {
      name: "Reflex",
      slug: "reflex",
      logo: "https://mewmewshopbd.com/uploads/brand/2024/1719452600.svg",
    },
    {
      name: "Reflex Plus",
      slug: "reflex-plus",
      logo: "https://mewmewshopbd.com/uploads/brand/2024/1719452616.png",
    },
    {
      name: "ROYAL CANIN",
      slug: "royal-canin",
      logo: "https://mewmewshopbd.com/uploads/brand/2024/1719452634.png",
    },
    {
      name: "Sheba",
      slug: "sheba",
      logo: "https://mewmewshopbd.com/uploads/brand/2024/1719452653.svg",
    },
  ];

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto">
        <div className="mb-6 text-center px-4">
          <h3 className="text-lg md:text-3xl font-bold text-[#26732d] flex items-center justify-center gap-2">
            <Award size={20} className="md:w-8 md:h-8" />
            FEATURED BRANDS
          </h3>
        </div>
        <div className="overflow-x-auto scrollbar-hide pb-2">
          <div className="flex justify-center items-center gap-4 md:gap-6 lg:gap-8 min-w-max px-4">
            {brands.map((brand, index) => (
              <Link
                key={index}
                href={
                  brand.slug.startsWith("/")
                    ? brand.slug
                    : `/brands/${brand.slug}`
                }
                className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-all duration-300 group hover:scale-105"
              >
                <div className="w-20 h-16 sm:w-24 sm:h-18 md:w-28 md:h-20 lg:w-32 lg:h-22 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 group-hover:shadow-md transition-shadow">
                  <img
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    className="w-full h-full object-contain p-2"
                    style={{
                      imageRendering: "auto",
                    }}
                    onError={(e) => {
                      // Fallback to a placeholder if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.src = `https://via.placeholder.com/150x100/f3f4f6/374151?text=${encodeURIComponent(brand.name)}`;
                    }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
