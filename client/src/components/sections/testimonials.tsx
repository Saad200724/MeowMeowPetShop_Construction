import { Star, MessageCircle } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Rahman',
      role: 'Cat Parent, Savar',
      image: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80',
      text: 'Meow Meow Pet Shop has the best quality pet food in Savar! My cat Luna loves their premium kibble and the delivery is always on time. Highly recommended!',
      rating: 5
    },
    {
      id: 2,
      name: 'Ahmed Hassan',
      role: 'Dog Parent, Savar',
      image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80',
      text: 'Amazing service and products! I\'ve been buying dog food and toys from here for 2 years. The staff is knowledgeable and always helps me choose the right products for Max.',
      rating: 5
    },
    {
      id: 3,
      name: 'Maria Sultana',
      role: 'Professional Groomer, Dhaka',
      image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80',
      text: 'As a professional pet groomer, I only recommend the best. Meow Meow Pet Shop has excellent grooming supplies and their bulk pricing helps my business. Great quality!',
      rating: 5
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star 
        key={index} 
        size={16} 
        className={index < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'} 
      />
    ));
  };

  return (
    <section className="section-spacing bg-gray-50">
      <div className="responsive-container">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#26732d] mb-8 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in">
          <MessageCircle size={32} className="text-[#26732d]" />
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id} 
              className="flex flex-col items-center text-center bg-white rounded-xl p-6 hover-lift animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img 
                src={testimonial.image} 
                alt={testimonial.name} 
                className="w-16 h-16 rounded-full mb-4 object-cover object-center border-4 border-[#ffde59] hover:scale-110 transition-transform duration-300" 
                loading="lazy"
                decoding="async"
              />
              <div className="flex justify-center mb-3">
                {renderStars(testimonial.rating)}
              </div>
              <p className="text-gray-700 mb-4 italic text-sm leading-relaxed">"{testimonial.text}"</p>
              <div className="font-bold text-[#26732d] text-lg">{testimonial.name}</div>
              <div className="text-sm text-gray-500">{testimonial.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}