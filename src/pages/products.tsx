import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Header from '@/components/layout/header'
import CollapsibleSidebar from '@/components/product/collapsible-sidebar'
import ProductCard from '@/components/product/product-card'
import AnalyticsBar from '@/components/product/analytics-bar'
import { getProductsByCategory, categories, type Product } from '@/lib/product-data'
import { Search, Filter, Grid, List } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLocation } from 'wouter'

export default function ProductsPage() {
  const [location] = useLocation()
  const [selectedCategory, setSelectedCategory] = useState<string>('cat-food')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Handle URL parameters for category selection
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const categoryParam = urlParams.get('category')
    if (categoryParam && categories.find(cat => cat.id === categoryParam)) {
      setSelectedCategory(categoryParam)
    }
  }, [location])

  const products = getProductsByCategory(selectedCategory)
  const categoryName = categories.find(cat => cat.id === selectedCategory)?.name || 'Products'

  // Filter and sort products
  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'rating':
          return b.rating - a.rating
        case 'reviews':
          return b.reviews - a.reviews
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex">
        {/* Sidebar */}
        <CollapsibleSidebar 
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:ml-0">
          {/* Header */}
          <div className="mb-6 sm:mb-8 pt-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#26732d] mb-2 animate-fade-in">
              {categoryName}
            </h1>
            <p className="text-gray-600 animate-slide-up text-sm sm:text-base">
              Discover our premium selection of {categoryName.toLowerCase()} products
            </p>
          </div>

          {/* Analytics Section */}
          <AnalyticsBar categoryId={selectedCategory} className="animate-fade-in" />

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 animate-slide-up">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10"
              />
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="price-low">Price (Low to High)</SelectItem>
                <SelectItem value="price-high">Price (High to Low)</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-none h-10 px-3"
              >
                <Grid size={16} />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-none h-10 px-3"
              >
                <List size={16} />
              </Button>
            </div>
          </div>

          {/* Products Grid/List */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="text-gray-400 mb-4">
                <Search size={40} className="mx-auto" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No products found</h3>
              <p className="text-gray-500 text-sm sm:text-base">
                Try adjusting your search terms or browse other categories
              </p>
            </div>
          ) : (
            <div className={cn(
              'grid gap-4 sm:gap-6',
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            )}>
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` } as React.CSSProperties}
                >
                  <ProductCard
                    product={product}
                    className={cn(
                      viewMode === 'list' && 'sm:flex sm:flex-row sm:h-48'
                    )}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Results Info */}
          <div className="mt-6 sm:mt-8 text-center text-gray-600 animate-fade-in text-sm sm:text-base">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>
      </div>
    </div>
  )
}