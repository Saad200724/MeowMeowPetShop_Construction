import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Filter, Heart, ShoppingCart, Play } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/footer';

const catToyCategories = [
  'Interactive Toys',
  'Feather Toys',
  'Catnip Toys',
  'Ball Toys',
  'Laser Pointers',
  'Scratching Posts',
  'Cat Tunnels',
  'Puzzle Toys',
  'Electronic Toys',
  'Teaser Wands',
  'Plush Toys',
  'Cat Trees'
];

const sampleProducts = [
  {
    id: 1,
    name: 'Interactive Feather Wand Toy',
    category: 'Feather Toys',
    price: '৳650',
    originalPrice: '৳800',
    image: '/api/placeholder/300/300',
    rating: 4.8,
    reviews: 124,
    inStock: true,
    brand: 'PetSafe',
    features: 'Retractable, Natural feathers'
  },
  {
    id: 2,
    name: 'Catnip Filled Mouse Toys Set',
    category: 'Catnip Toys',
    price: '৳350',
    originalPrice: '৳420',
    image: '/api/placeholder/300/300',
    rating: 4.6,
    reviews: 89,
    inStock: true,
    brand: 'Kong',
    features: 'Set of 6, Organic catnip'
  },
  {
    id: 3,
    name: 'Automatic Laser Pointer',
    category: 'Laser Pointers',
    price: '৳1,200',
    originalPrice: '৳1,500',
    image: '/api/placeholder/300/300',
    rating: 4.7,
    reviews: 156,
    inStock: true,
    brand: 'PetLibro',
    features: 'Auto timer, Random patterns'
  },
  {
    id: 4,
    name: 'Multi-Level Cat Tree Tower',
    category: 'Cat Trees',
    price: '৳8,500',
    originalPrice: '৳10,000',
    image: '/api/placeholder/300/300',
    rating: 4.9,
    reviews: 67,
    inStock: false,
    brand: 'Armarkat',
    features: '6 levels, Sisal scratching posts'
  },
  {
    id: 5,
    name: 'Cat Tunnel Play System',
    category: 'Cat Tunnels',
    price: '৳1,850',
    originalPrice: '৳2,200',
    image: '/api/placeholder/300/300',
    rating: 4.5,
    reviews: 43,
    inStock: true,
    brand: 'Pawaboo',
    features: 'Collapsible, 3-way tunnel'
  },
  {
    id: 6,
    name: 'Electronic Motion Fish Toy',
    category: 'Electronic Toys',
    price: '৳950',
    originalPrice: '৳1,200',
    image: '/api/placeholder/300/300',
    rating: 4.4,
    reviews: 92,
    inStock: true,
    brand: 'Potaroma',
    features: 'Motion sensor, USB rechargeable'
  }
];

export default function CatToysPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(sampleProducts);

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredProducts(sampleProducts);
    } else {
      setFilteredProducts(sampleProducts.filter(product => product.category === category));
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = sampleProducts.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.brand.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-8 px-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Play className="h-12 w-12" />
            <h1 className="text-4xl md:text-5xl font-bold">Cat Toys Collection</h1>
          </div>
          <p className="text-xl opacity-90 mb-6">Fun and engaging toys to keep your cats entertained</p>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search cat toys..."
              className="pl-10 bg-white text-gray-900"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              data-testid="input-search-cat-toys"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Categories Sidebar */}
          <aside className="lg:w-1/4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant={selectedCategory === 'All' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => handleCategoryFilter('All')}
                    data-testid="button-category-all"
                  >
                    All Toys
                  </Button>
                  {catToyCategories.map((category) => (
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
          </aside>

          {/* Products Grid */}
          <main className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {selectedCategory === 'All' ? 'All Cat Toys' : selectedCategory}
              </h2>
              <p className="text-gray-600">{filteredProducts.length} products found</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-all duration-300 group">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      data-testid={`button-wishlist-${product.id}`}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    {!product.inStock && (
                      <Badge variant="destructive" className="absolute top-2 left-2">
                        Out of Stock
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <Badge variant="secondary" className="mb-2 text-xs">
                      {product.category}
                    </Badge>
                    <h3 className="font-semibold mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.brand} • {product.features}</p>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          >
                            ★
                          </div>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">({product.reviews})</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-green-600">{product.price}</span>
                        <span className="text-sm text-gray-500 line-through ml-2">
                          {product.originalPrice}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        disabled={!product.inStock}
                        data-testid={`button-add-cart-${product.id}`}
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}