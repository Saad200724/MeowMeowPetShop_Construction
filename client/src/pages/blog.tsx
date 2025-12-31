import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Calendar, User, Clock, BookOpen, Heart, Share2 } from 'lucide-react';
import { Link } from 'wouter';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import NavigationSidebar from '@/components/layout/sidebar';
import { setSEO, seoMetadata } from '@/lib/seo';

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

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  image?: string;
  author: string;
  publishedAt?: Date;
  category?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Set SEO metadata
  useEffect(() => {
    setSEO({
      ...seoMetadata.blog,
      canonical: 'https://meowshopbd.me/blog',
    });
  }, []);

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const categoryParam = selectedCategory === 'All' ? '' : `?category=${encodeURIComponent(selectedCategory)}`;
        const response = await fetch(`/api/blog/published${categoryParam}`);
        const blogs = await response.json();
        setBlogPosts(blogs);
        setFilteredPosts(blogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setBlogPosts([]);
        setFilteredPosts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogs();
  }, [selectedCategory]);

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery(''); // Reset search when changing category
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = blogPosts.filter(post =>
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      (post.excerpt?.toLowerCase().includes(query.toLowerCase()) ?? false) ||
      (post.category?.toLowerCase().includes(query.toLowerCase()) ?? false)
    );
    setFilteredPosts(filtered);
  };

  const featuredPosts = blogPosts.slice(0, 2); // Show first 2 as featured

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NavigationSidebar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-8 px-4 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-1 mb-4">
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
            <div className="grid md:grid-cols-2 gap-1">
              {featuredPosts.map((post) => (
                <Card key={post._id} className="hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <img
                      src={post.image || '/api/placeholder/400/250'}
                      alt={post.title}
                      className="w-full h-56 object-cover"
                    />
                    <Badge className="absolute top-4 left-4 bg-indigo-600">
                      Featured
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <Badge variant="secondary" className="mb-3">
                      {post.category || 'General'}
                    </Badge>
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>5 min read</span>
                        </div>
                      </div>
                    </div>

                    <Link href={`/blog/${post.slug}`}>
                      <Button className="w-full" data-testid={`button-read-${post._id}`}>
                        Read Full Article
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-2 text-gray-600">Loading blog posts...</span>
          </div>
        )}
        
        {!loading && (
        <div className="flex flex-col lg:flex-row gap-1">
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

            {/* Contact Us */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Need Pet Care Advice?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Have questions about your pet's health or need personalized advice? Our experts are here to help.
                </p>
                <Link href="/contact">
                  <Button className="w-full" size="sm">
                    Contact Our Experts
                  </Button>
                </Link>
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

            <div className="grid gap-1">
              {filteredPosts.map((post) => (
                <Card key={post._id} className="hover:shadow-lg transition-all duration-300">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3">
                      <img
                        src={post.image || '/api/placeholder/400/250'}
                        alt={post.title}
                        className="w-full h-48 md:h-full object-cover rounded-l-lg"
                      />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <div className="flex items-center gap-1 mb-3">
                        <Badge variant="secondary">{post.category || 'General'}</Badge>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>5 min</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Link href={`/blog/${post.slug}`}>
                          <Button variant="outline" data-testid={`button-read-${post._id}`}>
                            Read More
                          </Button>
                        </Link>
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost" data-testid={`button-like-${post._id}`}>
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" data-testid={`button-share-${post._id}`}>
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredPosts.length === 0 && !loading && (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No blog posts found matching your criteria.</p>
              </div>
            )}
          </main>
        </div>
        )}
      </div>

      <Footer />
    </div>
  );
}