import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Filter, Heart, ShoppingCart } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/footer';

const catFoodCategories = [
  'Adult Food',
  'Cat Pouches',
  'Dry Food', 
  'Cat Can Food',
  'Cat Treats',
  'Wet Food',
  'Kitten Food',
  'Repack Food',
  'Kitten Milk',
  'Cat Dry Food',
  'Premium Dry',
  'Cat Wet Food',
  'Canned Food'
];

const sampleProducts = [
  {
    id: 1,
    name: 'Royal Canin Adult Cat Food',
    category: 'Adult Food',
    price: '৳1,850',
    originalPrice: '৳2,100',
    image: '/api/placeholder/300/300',
    rating: 4.8,
    reviews: 124,
    inStock: true,
    brand: 'Royal Canin',
    weight: '2kg'
  },
  {
    id: 2,
    name: 'Whiskas Cat Pouches Variety Pack',
    category: 'Cat Pouches',
    price: '৳450',
    originalPrice: '৳520',
    image: '/api/placeholder/300/300',
    rating: 4.6,
    reviews: 89,
    inStock: true,
    brand: 'Whiskas',
    weight: '12 pouches'
  },
  {
    id: 3,
    name: 'Hills Science Diet Kitten Food',
    category: 'Kitten Food',
    price: '৳2,200',
    originalPrice: '৳2,500',
    image: '/api/placeholder/300/300',
    rating: 4.9,
    reviews: 156,
    inStock: true,
    brand: 'Hills',
    weight: '1.5kg'
  },
  {
    id: 4,
    name: 'Felix As Good As It Looks',
    category: 'Wet Food',
    price: '৳320',
    originalPrice: '৳380',
    image: '/api/placeholder/300/300',
    rating: 4.4,
    reviews: 67,
    inStock: false,
    brand: 'Felix',
    weight: '400g'
  },
  {
    id: 5,
    name: 'Me-O Cat Treats Tuna',
    category: 'Cat Treats',
    price: '৳180',
    originalPrice: '৳220',
    image: '/api/placeholder/300/300',
    rating: 4.5,
    reviews: 43,
    inStock: true,
    brand: 'Me-O',
    weight: '150g'
  },
  {
    id: 6,
    name: 'Purina Pro Plan Premium Dry',
    category: 'Premium Dry',
    price: '৳3,200',
    originalPrice: '৳3,600',
    image: '/api/placeholder/300/300',
    rating: 4.7,
    reviews: 92,
    inStock: true,
    brand: 'Purina',
    weight: '3kg'
  }
];

export default function CatFoodPage() {
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
      <section className="pt-24 pb-8 px-4 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cat Food Collection</h1>
          <p className="text-xl opacity-90 mb-6">Premium nutrition for your feline friends</p>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search cat food products..."
              className="pl-10 bg-white text-gray-900"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              data-testid="input-search-cat-food"
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
                    All Products
                  </Button>
                  {catFoodCategories.map((category) => (
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
                {selectedCategory === 'All' ? 'All Cat Food Products' : selectedCategory}
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
                    <p className="text-sm text-gray-600 mb-2">{product.brand} • {product.weight}</p>
                    
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