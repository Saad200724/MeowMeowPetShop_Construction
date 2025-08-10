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
    <section className="section-spacing bg-gray-50">
      <div className="responsive-container">
        <h3 className="text-2xl sm:text-3xl font-bold text-center text-[#26732d] mb-8 animate-fade-in">Shop by Category</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-md hover-lift p-4 sm:p-6 text-center group cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 rounded-lg object-cover group-hover:scale-110 transition-transform duration-300" 
                loading="lazy"
                decoding="async"
              />
              <h4 className="font-semibold text-[#26732d] text-sm sm:text-base">{category.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
