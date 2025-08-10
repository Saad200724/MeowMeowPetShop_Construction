import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen } from 'lucide-react';

export default function BlogPreview() {
  const articles = [
    {
      id: 1,
      title: '10 Essential Tips for New Pet Owners',
      excerpt: 'Starting your journey as a pet parent? Here are the essential tips every new pet owner should know to ensure their furry friend stays happy and healthy.',
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
      date: 'March 15, 2024',
      slug: 'essential-tips-new-pet-owners'
    },
    {
      id: 2,
      title: 'Complete Guide to Pet Nutrition',
      excerpt: 'Understanding what to feed your pets and when is crucial for their health. Learn about the nutritional requirements for different pets and life stages.',
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
      date: 'March 12, 2024',
      slug: 'complete-pet-nutrition-guide'
    },
    {
      id: 3,
      title: 'Professional Grooming at Home',
      excerpt: 'Learn how to groom your pets like a professional at home. From basic brushing techniques to nail trimming, we cover everything you need to know.',
      image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
      date: 'March 10, 2024',
      slug: 'professional-grooming-at-home'
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-[#26732d] mb-8 flex items-center justify-center gap-3">
          <BookOpen size={32} className="text-[#26732d]" />
          Pet Care Tips & News
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map(article => (
            <article key={article.id} className="rounded-xl bg-white p-4 shadow hover:shadow-md transition-all duration-300 transform hover:scale-105">
              <img 
                src={article.image} 
                alt={article.title} 
                className="rounded-md mb-3 w-full h-48 object-cover" 
              />
              <div className="mb-2">
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">#Nutrition</span>
                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium ml-2">#Grooming</span>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-[#26732d]">{article.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{article.date}</p>
              <p className="text-sm text-gray-700 mb-4">{article.excerpt}</p>
              <button className="text-[#26732d] font-medium mt-2 inline-flex items-center hover:text-[#1e5d26] transition-colors">
                Read More <ArrowRight size={16} className="ml-1" />
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
