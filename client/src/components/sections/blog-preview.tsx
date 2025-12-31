import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Calendar, User, ArrowRight, BookOpen, BookText } from "lucide-react";

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

export default function BlogPreview() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopBlogs = async () => {
      try {
        const response = await fetch("/api/blog/published");
        const blogs = await response.json();
        // Get top 3 blogs
        setBlogPosts(blogs.slice(0, 3));
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setBlogPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopBlogs();
  }, []);

  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-lg md:text-3xl font-bold mb-4 flex items-center justify-center gap-2" style={{ color: "#26732d" }}>
              <BookOpen size={20} className="text-[#26732d] md:w-8 md:h-8" />
              LATEST PET CARE TIPS
            </h2>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (blogPosts.length === 0) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-lg md:text-3xl font-bold mb-4 flex items-center justify-center gap-2" style={{ color: "#26732d" }}>
              <BookOpen size={20} className="text-[#26732d] md:w-8 md:h-8" />
              LATEST PET CARE TIPS
            </h2>
            <p className="text-gray-600">
              No blog posts available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-lg md:text-3xl font-bold text-center text-[#26732d] flex items-center justify-center gap-2 mb-6">
            <BookText size={20} className="md:w-8 md:h-8" />
            LATEST PET CARE TIPS
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-4">
            Stay informed with expert advice and insights to keep your pets
            healthy and happy.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 mb-8">
          {blogPosts.map((post, index) => (
            <Card
              key={post._id}
              className={`group hover:shadow-lg transition-all duration-300 overflow-hidden ${
                index === 2 ? 'hidden md:block' : ''
              }`}
            >
              <div className="relative">
                <img
                  src={post.image || "/api/placeholder/400/200"}
                  alt={post.title}
                  className="w-full h-36 sm:h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-indigo-600 text-xs">
                  {post.category || "General"}
                </Badge>
              </div>

              <CardContent className="p-3 sm:p-4 md:p-6">
                <h3 className="text-sm sm:text-base md:text-xl font-bold mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-tight">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-3 sm:mb-4 line-clamp-2 text-xs sm:text-sm md:text-base">
                  {post.excerpt || post.content.substring(0, 100) + "..."}
                </p>

                <div className="flex flex-col gap-2 mb-3 sm:mb-4 text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="truncate">{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs">
                      {new Date(
                        post.publishedAt || post.createdAt,
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "2-digit"
                      })}
                    </span>
                  </div>
                </div>

                <Link href={`/blog/${post.slug}`}>
                  <Button
                    variant="outline"
                    className="w-full group text-xs sm:text-sm py-2 h-auto"
                    size="sm"
                  >
                    Read More
                    <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center px-4">
          <Link href="/blog">
            <Button size="lg" className="group text-sm sm:text-base">
              <BookOpen className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              View All Articles
              <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}