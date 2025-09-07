import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User, Clock, Share2, Heart } from 'lucide-react';
import { Link } from 'wouter';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  image?: string;
  author: string;
  publishedAt?: Date;
  tags?: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function BlogDetailPage() {
  const [match, params] = useRoute('/blog/:slug');
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!match || !params?.slug) return;

    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/blog/slug/${params.slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Blog post not found');
          } else {
            setError('Failed to load blog post');
          }
          return;
        }
        
        const post = await response.json();
        setBlogPost(post);
      } catch (error) {
        console.error('Error fetching blog post:', error);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [match, params?.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-24">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-2 text-gray-600">Loading blog post...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !blogPost) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-24">
          <Card className="text-center py-12">
            <CardContent>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {error || 'Blog post not found'}
              </h1>
              <p className="text-gray-600 mb-6">
                The blog post you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/blog">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const formatContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => {
      if (paragraph.trim() === '') return null;
      
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        return (
          <h3 key={index} className="text-xl font-bold mt-6 mb-3 text-gray-900">
            {paragraph.slice(2, -2)}
          </h3>
        );
      }
      
      if (paragraph.startsWith('- ')) {
        return (
          <li key={index} className="ml-4 mb-2 text-gray-700">
            {paragraph.slice(2)}
          </li>
        );
      }
      
      return (
        <p key={index} className="mb-4 text-gray-700 leading-relaxed">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <article className="max-w-4xl mx-auto px-4 py-24">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/blog">
            <Button variant="ghost" className="text-indigo-600 hover:text-indigo-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>

        {/* Hero Image */}
        <div className="mb-8">
          <img
            src={blogPost.image || '/api/placeholder/800/400'}
            alt={blogPost.title}
            className="w-full h-80 object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Article Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center gap-1 mb-4">
              <Badge variant="secondary" className="text-indigo-600">
                {blogPost.tags?.[0] || 'General'}
              </Badge>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight break-words">
              {blogPost.title}
            </h1>
            
            {blogPost.excerpt && (
              <p className="text-lg md:text-xl text-gray-600 mb-6 leading-relaxed">
                {blogPost.excerpt}
              </p>
            )}
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-gray-200 pt-6 gap-1">
              <div className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{blogPost.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(blogPost.publishedAt || blogPost.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>5 min read</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Article Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none">
              <div className="text-base md:text-lg leading-relaxed">
                {formatContent(blogPost.content)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        {blogPost.tags && blogPost.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-1">
              {blogPost.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 bg-indigo-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Have Questions About Pet Care?
          </h3>
          <p className="text-gray-600 mb-6">
            Contact our experts for personalized advice and support for your pet's needs.
          </p>
          <Link href="/contact">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              Contact Us
            </Button>
          </Link>
        </div>
      </article>
      
      <Footer />
    </div>
  );
}