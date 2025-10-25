import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import ProductCard from '@/components/product/product-card'
import { useProducts } from '@/hooks/use-products'
import { categories } from '@/lib/product-data'
import { Search, Filter, Grid, List, X, SlidersHorizontal, ChevronRight, Home, Package, Star, TrendingUp, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLocation, Link } from 'wouter'

export default function ProductsPage() {
  const [location] = useLocation()
  const [selectedCategory, setSelectedCategory] = useState<string>('cat-food')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [minRating, setMinRating] = useState(0)
  const [showOnlyInStock, setShowOnlyInStock] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  
  const { products: allProducts, loading, error, getProductsByCategory } = useProducts()

  // Handle URL parameters for category and subcategory selection
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const categoryParam = urlParams.get('category')
    const subcategoryParam = urlParams.get('subcategory')
    
    if (subcategoryParam) {
      setSelectedCategory(subcategoryParam)
    } else if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [location])

  const products = getProductsByCategory(selectedCategory)
  const categoryInfo = categories.find(cat => cat.id === selectedCategory)
  const categoryName = categoryInfo?.name || 'Products'

  // Get unique brands from all products
  const allBrands = Array.from(new Set(allProducts.map(p => p.brandName || 'Unknown').filter(Boolean)))

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brandName || 'Unknown')
      
      const matchesRating = product.rating >= minRating
      
      const matchesStock = !showOnlyInStock || (product.stockQuantity && product.stockQuantity > 0)
      
      return matchesSearch && matchesPrice && matchesBrand && matchesRating && matchesStock
    })
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
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    )
  }

  const clearFilters = () => {
    setPriceRange([0, 10000])
    setSelectedBrands([])
    setMinRating(0)
    setShowOnlyInStock(false)
  }

  const hasActiveFilters = priceRange[0] > 0 || priceRange[1] < 10000 || selectedBrands.length > 0 || minRating > 0 || showOnlyInStock

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="py-4 flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-[#26732d] transition-colors flex items-center gap-1" data-testid="link-home">
            <Home size={16} />
            <span>Home</span>
          </Link>
          <ChevronRight size={16} className="text-gray-400" />
          <Link href="/products" className="hover:text-[#26732d] transition-colors" data-testid="link-products">
            Products
          </Link>
          <ChevronRight size={16} className="text-gray-400" />
          <span className="text-[#26732d] font-medium">{categoryName}</span>
        </div>

        {/* Category Header */}
        <div className="mb-8 bg-gradient-to-r from-[#26732d] to-[#1f5d26] rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-4xl">
              {categoryInfo?.icon || '📦'}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center gap-3">
                {categoryName}
                <Badge className="bg-[#ffde59] text-[#26732d] hover:bg-[#ffd73e] text-sm">
                  {filteredProducts.length} Products
                </Badge>
              </h1>
              <p className="text-white/90 text-lg">
                Discover our premium selection of {categoryName.toLowerCase()} products for your beloved pets
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
                <Package size={16} />
                <span>Total Items</span>
              </div>
              <div className="text-2xl font-bold">{products.length}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
                <Star size={16} />
                <span>Avg Rating</span>
              </div>
              <div className="text-2xl font-bold">
                {products.length > 0 ? (products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1) : '0'}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
                <TrendingUp size={16} />
                <span>Bestsellers</span>
              </div>
              <div className="text-2xl font-bold">
                {products.filter(p => p.isBestseller).length}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
                <Tag size={16} />
                <span>New Arrivals</span>
              </div>
              <div className="text-2xl font-bold">
                {products.filter(p => p.isNew).length}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-4 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal size={20} />
                  Filters
                </h3>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                    data-testid="button-clear-filters"
                  >
                    Clear All
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                {/* Price Range */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">
                    Price Range
                  </label>
                  <Slider
                    min={0}
                    max={10000}
                    step={100}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mb-3"
                  />
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="font-medium">৳{priceRange[0]}</span>
                    <span className="font-medium">৳{priceRange[1]}</span>
                  </div>
                </div>

                <Separator />

                {/* Brand Filter */}
                {allBrands.length > 0 && (
                  <>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-3 block">
                        Brands
                      </label>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {allBrands.slice(0, 10).map((brand) => (
                          <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                            <Checkbox
                              checked={selectedBrands.includes(brand)}
                              onCheckedChange={() => toggleBrand(brand)}
                              data-testid={`checkbox-brand-${brand.toLowerCase().replace(/\s+/g, '-')}`}
                            />
                            <span className="text-sm text-gray-700 group-hover:text-[#26732d] transition-colors">
                              {brand}
                            </span>
                            <span className="text-xs text-gray-400 ml-auto">
                              ({products.filter(p => p.brandName === brand).length})
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <Separator />
                  </>
                )}

                {/* Rating Filter */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">
                    Minimum Rating
                  </label>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <label
                        key={rating}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <Checkbox
                          checked={minRating === rating}
                          onCheckedChange={(checked) => setMinRating(checked ? rating : 0)}
                          data-testid={`checkbox-rating-${rating}`}
                        />
                        <div className="flex items-center gap-1">
                          {Array.from({ length: rating }).map((_, i) => (
                            <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="text-sm text-gray-600 group-hover:text-[#26732d]">& up</span>
                        </div>
                        <span className="text-xs text-gray-400 ml-auto">
                          ({products.filter(p => p.rating >= rating).length})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Availability */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <Checkbox
                      checked={showOnlyInStock}
                      onCheckedChange={setShowOnlyInStock}
                      data-testid="checkbox-in-stock"
                    />
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-[#26732d]">
                      In Stock Only
                    </span>
                    <span className="text-xs text-gray-400 ml-auto">
                      ({products.filter(p => p.stockQuantity && p.stockQuantity > 0).length})
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Search and Controls */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              {/* Search */}
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 border-gray-200 focus:border-[#26732d] focus:ring-[#26732d]"
                  data-testid="input-search"
                />
              </div>

              {/* Mobile Filter Button */}
              <Button
                variant="outline"
                className="lg:hidden h-11 gap-2"
                onClick={() => setShowFilters(!showFilters)}
                data-testid="button-toggle-filters"
              >
                <SlidersHorizontal size={18} />
                Filters
                {hasActiveFilters && (
                  <Badge className="bg-[#26732d] text-white ml-1">{selectedBrands.length + (minRating > 0 ? 1 : 0) + (showOnlyInStock ? 1 : 0)}</Badge>
                )}
              </Button>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-56 h-11 border-gray-200" data-testid="select-sort">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="price-low">Price (Low to High)</SelectItem>
                  <SelectItem value="price-high">Price (High to Low)</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "rounded-none h-11 px-4",
                    viewMode === 'grid' && "bg-[#26732d] text-white hover:bg-[#1f5d26]"
                  )}
                  data-testid="button-view-grid"
                >
                  <Grid size={16} />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "rounded-none h-11 px-4",
                    viewMode === 'list' && "bg-[#26732d] text-white hover:bg-[#1f5d26]"
                  )}
                  data-testid="button-view-list"
                >
                  <List size={16} />
                </Button>
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <SlidersHorizontal size={20} />
                    Filters
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(false)}
                    data-testid="button-close-filters"
                  >
                    <X size={20} />
                  </Button>
                </div>

                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="w-full mb-4 text-red-600 hover:text-red-700 hover:bg-red-50"
                    data-testid="button-clear-filters-mobile"
                  >
                    Clear All Filters
                  </Button>
                )}

                <div className="space-y-6">
                  {/* Mobile Price Range */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">
                      Price Range
                    </label>
                    <Slider
                      min={0}
                      max={10000}
                      step={100}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="mb-3"
                    />
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className="font-medium">৳{priceRange[0]}</span>
                      <span className="font-medium">৳{priceRange[1]}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Mobile Brand Filter */}
                  {allBrands.length > 0 && (
                    <>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-3 block">
                          Brands
                        </label>
                        <div className="space-y-2">
                          {allBrands.slice(0, 10).map((brand) => (
                            <label key={brand} className="flex items-center gap-2 cursor-pointer">
                              <Checkbox
                                checked={selectedBrands.includes(brand)}
                                onCheckedChange={() => toggleBrand(brand)}
                              />
                              <span className="text-sm text-gray-700">{brand}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <Separator />
                    </>
                  )}

                  {/* Mobile Rating Filter */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">
                      Minimum Rating
                    </label>
                    <div className="space-y-2">
                      {[4, 3, 2, 1].map((rating) => (
                        <label
                          key={rating}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Checkbox
                            checked={minRating === rating}
                            onCheckedChange={(checked) => setMinRating(checked ? rating : 0)}
                          />
                          <div className="flex items-center gap-1">
                            {Array.from({ length: rating }).map((_, i) => (
                              <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                            ))}
                            <span className="text-sm text-gray-600">& up</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Mobile Availability */}
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={showOnlyInStock}
                        onCheckedChange={setShowOnlyInStock}
                      />
                      <span className="text-sm font-semibold text-gray-700">
                        In Stock Only
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <span className="text-sm font-medium text-gray-700">Active Filters:</span>
                {selectedBrands.map(brand => (
                  <Badge
                    key={brand}
                    variant="secondary"
                    className="bg-white border border-gray-200 text-gray-700 gap-1"
                    data-testid={`badge-filter-${brand.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {brand}
                    <X
                      size={14}
                      className="cursor-pointer hover:text-red-600"
                      onClick={() => toggleBrand(brand)}
                    />
                  </Badge>
                ))}
                {minRating > 0 && (
                  <Badge variant="secondary" className="bg-white border border-gray-200 text-gray-700 gap-1">
                    {minRating}+ Stars
                    <X
                      size={14}
                      className="cursor-pointer hover:text-red-600"
                      onClick={() => setMinRating(0)}
                    />
                  </Badge>
                )}
                {showOnlyInStock && (
                  <Badge variant="secondary" className="bg-white border border-gray-200 text-gray-700 gap-1">
                    In Stock
                    <X
                      size={14}
                      className="cursor-pointer hover:text-red-600"
                      onClick={() => setShowOnlyInStock(false)}
                    />
                  </Badge>
                )}
              </div>
            )}

            {/* Products Grid/List */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your filters or search terms
                </p>
                {hasActiveFilters && (
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="border-[#26732d] text-[#26732d] hover:bg-[#26732d] hover:text-white"
                    data-testid="button-clear-filters-empty"
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className={cn(
                  'grid gap-6',
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                )}>
                  {filteredProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="animate-fade-in transform transition-all duration-300 hover:scale-105"
                      style={{ animationDelay: `${index * 0.05}s` } as React.CSSProperties}
                      data-testid={`card-product-${product.id}`}
                    >
                      <ProductCard
                        product={product}
                        className={cn(
                          'shadow-md hover:shadow-xl transition-all duration-300 border-0',
                          viewMode === 'list' && 'sm:flex sm:flex-row sm:h-48'
                        )}
                      />
                    </div>
                  ))}
                </div>

                {/* Results Info */}
                <div className="mt-8 text-center">
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-sm border border-gray-100">
                    <Package size={16} className="text-[#26732d]" />
                    <span className="text-sm font-medium text-gray-700">
                      Showing <span className="text-[#26732d] font-bold">{filteredProducts.length}</span> of <span className="font-bold">{products.length}</span> products
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  )
}
