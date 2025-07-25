import { Cat, Dog, Heart, Gift, ShoppingBag } from 'lucide-react';

export default function CategoriesGrid() {
  const categories = [
    {
      id: 1,
      name: 'Cat Food & Treats',
      icon: Cat,
      image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&q=80',
      count: '120+ Products',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 2,
      name: 'Dog Food & Treats',
      icon: Dog,
      image: 'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=500&q=80',
      count: '150+ Products',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 3,
      name: 'Pet Toys',
      icon: Gift,
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&q=80',
      count: '80+ Products',
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 4,
      name: 'Pet Care & Health',
      icon: Heart,
      image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=500&q=80',
      count: '60+ Products',
      color: 'bg-red-100 text-red-600'
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-[#26732d] mb-8 flex items-center justify-center gap-3">
          <ShoppingBag size={32} className="text-[#26732d]" />
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(category => {
            const IconComponent = category.icon;
            return (
              <div 
                key={category.id} 
                className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
              >
                <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-xl">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <div className={`p-3 rounded-full ${category.color} mb-3`}>
                      <IconComponent size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-center mb-2">{category.name}</h3>
                    <p className="text-sm text-gray-200">{category.count}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}