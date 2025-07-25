export default function FeaturedCategories() {
  const categories = [
    {
      name: 'Cat Food',
      image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Dog Food', 
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Toys',
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Grooming',
      image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Accessories',
      image: 'https://images.unsplash.com/photo-1615789591457-74a63395c990?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      name: 'Health Care',
      image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h3 className="text-3xl font-bold text-center text-meow-green mb-8">Shop by Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 text-center group cursor-pointer">
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-16 h-16 mx-auto mb-3 rounded-lg object-cover group-hover:scale-110 transition-transform" 
              />
              <h4 className="font-semibold text-meow-green">{category.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
