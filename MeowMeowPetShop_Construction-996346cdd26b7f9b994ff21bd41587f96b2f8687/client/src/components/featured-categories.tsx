import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import type { Category } from "@shared/schema";

export default function FeaturedCategories() {
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  if (isLoading) {
    return (
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-40"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="group bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-gray-200 rounded-lg"
            >
              <CardContent className="p-4 text-center">
                <div className="bg-gray-50 rounded-lg p-4 mb-3">
                  <img
                    src={category.image || "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"}
                    alt={category.name}
                    className="w-16 h-16 mx-auto object-contain"
                  />
                </div>
                <h4 className="text-sm font-medium text-gray-800">{category.name}</h4>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
