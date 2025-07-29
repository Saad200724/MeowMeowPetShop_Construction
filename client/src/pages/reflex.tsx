import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Filter, Heart, ShoppingCart, Award } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/footer';

const reflexCategories = [
  'Cat Food',
  'Dog Food',
  'Puppy Food',
  'Kitten Food',
  'Senior Pet Food',
  'Grain-Free',
  'Premium Line',
  'Natural Formula'
];

const sampleProducts = [
  {
    id: 1,
    name: 'Reflex Plus Adult Cat Food Chicken',
    category: 'Cat Food',
    price: '৳1,850',
    originalPrice: '৳2,100',
    image: '/api/placeholder/300/300',
    rating: 4.9,
    reviews: 267,
    inStock: true,
    weight: '3kg',
    formula: 'Complete & Balanced'
  },
  {
    id: 2,
    name: 'Reflex Plus Puppy Food Lamb & Rice',
    category: 'Puppy Food',
    price: '৳2,200',
    originalPrice: '৳2,500',
    image: '/api/placeholder/300/300',
    rating: 4.8,
    reviews: 189,
    inStock: true,
    weight: '3kg',
    formula: 'High Protein'
  },
  {
    id: 3,
    name: 'Reflex Plus Kitten Food Salmon',
    category: 'Kitten Food',
    price: '৳1,650',
    originalPrice: '৳1,900',
    image: '/api/placeholder/300/300',
    rating: 4.9,
    reviews: 234,
    inStock: true,
    weight: '1.5kg',
    formula: 'DHA Enriched'
  },
  {
    id: 4,
    name: 'Reflex Plus Adult Dog Food Beef',
    category: 'Dog Food',
    price: '৳2,450',
    originalPrice: '৳2,800',
    image: '/api/placeholder/300/300',
    rating: 4.7,
    reviews: 156,
    inStock: false,
    weight: '15kg',
    formula: 'Premium Quality'
  },
  {
    id: 5,
    name: 'Reflex Grain-Free Cat Food Turkey',
    category: 'Grain-Free',
    price: '৳2,800',
    originalPrice: '৳3,200',
    image: '/api/placeholder/300/300',
    rating: 4.8,
    reviews: 98,
    inStock: true,
    weight: '2kg',
    formula: 'Grain-Free Recipe'
  },
  {
    id: 6,
    name: 'Reflex Senior Dog Food Formula',
    category: 'Senior Pet Food',
    price: '৳2,600',
    originalPrice: '৳3,000',
    image: '/api/placeholder/300/300',
    rating: 4.6,
    reviews: 124,
    inStock: true,
    weight: '12kg',
    formula: 'Joint Support'
  }
];

export default function ReflexPage() {
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
      product.category.toLowerCase().includes(query.toLowerCase()) ||
      product.formula.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-8 px-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Award className="h-12 w-12" />
            <h1 className="text-4xl md:text-5xl font-bold">Reflex Plus</h1>
          </div>
          <p className="text-xl opacity-90 mb-6">Premium pet nutrition from Turkey's leading brand</p>
          <div className="flex flex-wrap gap-4 mb-6">
            <Badge className="bg-white/20 text-white border-white/30">Premium Quality</Badge>
            <Badge className="bg-white/20 text-white border-white/30">Scientifically Formulated</Badge>
            <Badge className="bg-white/20 text-white border-white/30">Trusted by Vets</Badge>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search Reflex products..."
              className="pl-10 bg-white text-gray-900"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              data-testid="input-search-reflex"
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
                  {reflexCategories.map((category) => (
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

            {/* Brand Info */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>About Reflex Plus</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 space-y-2">
                <p>Premium pet food brand from Turkey, trusted by pet owners worldwide.</p>
                <ul className="space-y-1">
                  <li>• Scientifically formulated</li>
                  <li>• High-quality ingredients</li>
                  <li>• Veterinarian recommended</li>
                  <li>• Complete & balanced nutrition</li>
                </ul>
              </CardContent>
            </Card>
          </aside>

          {/* Products Grid */}
          <main className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {selectedCategory === 'All' ? 'All Reflex Products' : selectedCategory}
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
                    <Badge className="absolute bottom-2 left-2 bg-amber-600">
                      Reflex Plus
                    </Badge>
                  </div>

                  <CardContent className="p-4">
                    <Badge variant="secondary" className="mb-2 text-xs">
                      {product.category}
                    </Badge>
                    <h3 className="font-semibold mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.weight} • {product.formula}</p>
                    
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