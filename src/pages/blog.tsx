import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Calendar, User, Clock, BookOpen, Heart, Share2 } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/footer';

const blogCategories = [
  'Pet Care Tips',
  'Cat Health',
  'Dog Health',
  'Training',
  'Nutrition',
  'Grooming',
  'Behavior',
  'Product Reviews'
];

const blogPosts = [
  {
    id: 1,
    title: '10 Essential Cat Care Tips Every Owner Should Know',
    excerpt: 'Discover the fundamental aspects of cat care that will keep your feline friend happy and healthy throughout their life.',
    content: 'Complete guide covering nutrition, health, grooming, and behavioral aspects...',
    category: 'Cat Health',
    author: 'Dr. Sarah Rahman',
    date: '2025-01-25',
    readTime: 8,
    image: '/api/placeholder/400/250',
    featured: true,
    tags: ['cat care', 'health', 'tips']
  },
  {
    id: 2,
    title: 'The Ultimate Guide to Dog Training: From Puppy to Adult',
    excerpt: 'Learn effective training techniques that work for dogs of all ages and breeds.',
    content: 'Comprehensive training guide including basic commands, house training, and behavioral correction...',
    category: 'Training',
    author: 'Ahmed Khan',
    date: '2025-01-22',
    readTime: 12,
    image: '/api/placeholder/400/250',
    featured: false,
    tags: ['dog training', 'puppy', 'behavior']
  },
  {
    id: 3,
    title: 'Choosing the Right Food for Your Pet: A Complete Nutrition Guide',
    excerpt: 'Understanding pet nutrition labels and making informed decisions about your pet\'s diet.',
    content: 'Detailed nutrition guide covering ingredients, feeding schedules, and dietary requirements...',
    category: 'Nutrition',
    author: 'Dr. Fatima Ali',
    date: '2025-01-20',
    readTime: 10,
    image: '/api/placeholder/400/250',
    featured: true,
    tags: ['nutrition', 'pet food', 'health']
  },
  {
    id: 4,
    title: 'Professional Grooming at Home: Tools and Techniques',
    excerpt: 'Learn how to groom your pets like a professional with the right tools and techniques.',
    content: 'Step-by-step grooming guide with professional tips and tool recommendations...',
    category: 'Grooming',
    author: 'Rashida Begum',
    date: '2025-01-18',
    readTime: 6,
    image: '/api/placeholder/400/250',
    featured: false,
    tags: ['grooming', 'tools', 'diy']
  },
  {
    id: 5,
    title: 'Understanding Your Cat\'s Behavior: Signs and Solutions',
    excerpt: 'Decode your cat\'s behavior patterns and learn how to address common issues.',
    content: 'Behavioral guide covering communication, stress signs, and environmental enrichment...',
    category: 'Behavior',
    author: 'Dr. Karim Hassan',
    date: '2025-01-15',
    readTime: 9,
    image: '/api/placeholder/400/250',
    featured: false,
    tags: ['cat behavior', 'psychology', 'solutions']
  },
  {
    id: 6,
    title: 'Product Review: Best Cat Litters of 2025',
    excerpt: 'Comprehensive review and comparison of the top cat litter brands available in Bangladesh.',
    content: 'Detailed product reviews with pros, cons, and recommendations...',
    category: 'Product Reviews',
    author: 'Meow Meow Team',
    date: '2025-01-12',
    readTime: 7,
    image: '/api/placeholder/400/250',
    featured: false,
    tags: ['product review', 'cat litter', '2025']
  }
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredPosts(blogPosts);
    } else {
      setFilteredPosts(blogPosts.filter(post => post.category === category));
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = blogPosts.filter(post =>
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
      post.category.toLowerCase().includes(query.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredPosts(filtered);
  };

  const featuredPosts = blogPosts.filter(post => post.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-8 px-4 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <BookOpen className="h-12 w-12" />
            <h1 className="text-4xl md:text-5xl font-bold">Pet Care Blog</h1>
          </div>
          <p className="text-xl opacity-90 mb-6">Expert advice, tips, and insights for better pet care</p>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search blog posts..."
              className="pl-10 bg-white text-gray-900"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              data-testid="input-search-blog"
            />
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {selectedCategory === 'All' && !searchQuery && (
        <section className="py-12 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Featured Articles</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.slice(0, 2).map((post) => (
                <Card key={post.id} className="hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-56 object-cover"
                    />
                    <Badge className="absolute top-4 left-4 bg-indigo-600">
                      Featured
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <Badge variant="secondary" className="mb-3">
                      {post.category}
                    </Badge>
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(post.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{post.readTime} min read</span>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full" data-testid={`button-read-${post.id}`}>
                      Read Full Article
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Categories Sidebar */}
          <aside className="lg:w-1/4">
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant={selectedCategory === 'All' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => handleCategoryFilter('All')}
                    data-testid="button-category-all"
                  >
                    All Posts
                  </Button>
                  {blogCategories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => handleCategoryFilter(category)}
                      data-testid={`button-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Stay Updated</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Get the latest pet care tips and product updates delivered to your inbox.
                </p>
                <div className="space-y-2">
                  <Input placeholder="Your email address" type="email" />
                  <Button className="w-full" size="sm">
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Blog Posts Grid */}
          <main className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {selectedCategory === 'All' ? 'All Blog Posts' : selectedCategory}
              </h2>
              <p className="text-gray-600">{filteredPosts.length} articles found</p>
            </div>

            <div className="grid gap-6">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-all duration-300">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-48 md:h-full object-cover rounded-l-lg"
                      />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary">{post.category}</Badge>
                        {post.featured && (
                          <Badge className="bg-indigo-600">Featured</Badge>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(post.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{post.readTime} min</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Button variant="outline" data-testid={`button-read-${post.id}`}>
                          Read More
                        </Button>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost" data-testid={`button-like-${post.id}`}>
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" data-testid={`button-share-${post.id}`}>
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No blog posts found matching your criteria.</p>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}