import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@shared/schema";

export default function FlashSale() {
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products/flash-sale'],
  });

  if (isLoading) {
    return (
      <section className="py-12 bg-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-purple-700 mb-2">Flash Sale</h3>
            <Button className="bg-purple-600 text-white px-6 py-2 rounded-lg text-sm">
              View All
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg h-64 animate-pulse border"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-purple-700 mb-2">Flash Sale</h3>
          <Button className="bg-purple-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-purple-700">
            View All
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="bg-white shadow-sm hover:shadow-md transition-shadow border rounded-lg">
              <CardContent className="p-3">
                <div className="relative mb-3">
                  <img
                    src={product.image || ""}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  {product.discountAmount && (
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1">
                      -৳{product.discountAmount}
                    </Badge>
                  )}
                </div>
                <Badge className="bg-purple-100 text-purple-700 mb-2 text-xs">
                  Cat Treats
                </Badge>
                <h4 className="font-medium mb-2 text-xs text-gray-800 line-clamp-2">{product.name}</h4>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-purple-600">৳{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">৳{product.originalPrice}</span>
                    )}
                  </div>
                  <Button className="w-full bg-purple-600 text-white hover:bg-purple-700 text-xs py-1 h-7">
                    View Product
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
