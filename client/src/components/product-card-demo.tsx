import ProductCard from '@/components/ui/product-card';

// Demo component showcasing the enhanced product card
export default function ProductCardDemo() {
  // Example product following your exact specification
  const sampleProduct = {
    name: "Bonacibo Kitten Food",
    price: "850",
    oldPrice: "950", 
    discount: "-15%",
    stock: "In Stock",
    image: "/uploads/image-1756580170574-172752142.webp" // Using existing image from your uploads
  };

  // Additional demo products with different variations
  const demoProducts = [
    {
      name: "Bonacibo Kitten Food Premium",
      price: "850",
      oldPrice: "950",
      discount: "-100",
      stock: "In Stock",
      image: "/uploads/image-1756580170574-172752142.webp"
    },
    {
      name: "Royal Canin Adult Cat Food - High Quality Nutrition for Healthy Growth",
      price: "1200",
      stock: "In Stock", 
      image: "/uploads/image-1756580170574-172752142.webp"
    },
    {
      name: "Premium Dog Food",
      price: "750",
      oldPrice: "900",
      discount: "-17%",
      stock: "Low Stock",
      image: "/uploads/image-1756580170574-172752142.webp"
    },
    {
      name: "Cat Treats Deluxe",
      price: "450",
      stock: "Out of Stock",
      image: "/uploads/image-1756580170574-172752142.webp"
    }
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Enhanced Product Card Demo
        </h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Your Example Product:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProductCard product={sampleProduct} />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Responsive Grid Layout (Desktop: 4 per row, Tablet: 2 per row, Mobile: 1 per row):
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {demoProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        </div>

        <div className="mt-12 p-6 bg-white rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Features Implemented:</h3>
          <ul className="space-y-2 text-gray-600">
            <li>✅ Product image centered and fitted (no crop, no stretch)</li>
            <li>✅ Product name with truncation for long titles</li>
            <li>✅ Price in green, old price in red with strikethrough</li>
            <li>✅ Discount badge in red on top-left of image</li>
            <li>✅ Stock status in appropriate colors (green/orange/red)</li>
            <li>✅ Static 5-star ratings (all filled by default)</li>
            <li>✅ "Add to Cart" button with hover effects</li>
            <li>✅ Rounded corners, shadows, and equal height cards</li>
            <li>✅ Responsive grid layout</li>
            <li>✅ Tailwind CSS only (no external CSS)</li>
            <li>✅ Supports various image resolutions (526x526, 1200x1200, 300x300)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}