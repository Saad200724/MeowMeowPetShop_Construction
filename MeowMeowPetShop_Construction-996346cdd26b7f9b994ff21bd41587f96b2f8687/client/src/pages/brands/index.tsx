import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Building2, Award } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import NavigationSidebar from '@/components/layout/sidebar';

interface Brand {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  isActive?: boolean;
}

export default function BrandsPage() {
  const { data: brands = [], isLoading } = useQuery<Brand[]>({
    queryKey: ['/api/brands'],
  });

  const activeBrands = brands.filter(brand => brand.isActive !== false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NavigationSidebar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-2xl md:text-4xl font-bold text-[#26732d] flex items-center justify-center gap-3">
              <Award size={32} className="md:w-10 md:h-10" />
              All Brands
            </h1>
            <p className="text-gray-600 mt-2">Explore our collection of premium pet food brands</p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#26732d]"></div>
            </div>
          ) : activeBrands.length === 0 ? (
            <div className="text-center py-16">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No brands available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {activeBrands.map((brand, index) => (
                <Link
                  key={brand._id || brand.id || index}
                  href={`/brands/${brand.slug}`}
                  className="group"
                  data-testid={`brand-card-${brand.slug}`}
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group-hover:scale-105 p-4">
                    <div className="aspect-square flex items-center justify-center">
                      {brand.logo ? (
                        <img
                          src={brand.logo}
                          alt={`${brand.name} logo`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://via.placeholder.com/150x150/f3f4f6/374151?text=${encodeURIComponent(brand.name)}`;
                          }}
                        />
                      ) : (
                        <Building2 className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    <div className="mt-3 text-center">
                      <h3 className="font-semibold text-gray-900 group-hover:text-[#26732d] transition-colors">
                        {brand.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
