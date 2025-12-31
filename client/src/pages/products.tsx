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
import { setSEO, seoMetadata } from '@/lib/seo'
import { Search, Filter, Grid, List, X, SlidersHorizontal, ChevronRight, Home, Package, Star, TrendingUp, Tag, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLocation, Link } from 'wouter'

export default function ProductsPage() {
  useEffect(() => {
    setSEO({
      ...seoMetadata.products,
      canonical: 'https://meowmeowpetshop.com/products',
    });
  }, []);
  const [location] = useLocation()
  const [selectedCategory, setSelectedCategory] = useState<string>('cat-food')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [minRating, setMinRating] = useState(0)
  const [showOnlyInStock, setShowOnlyInStock] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  
  const { products: allProducts, loading, error, getProductsByCategory } = useProducts()

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

  const allBrands = Array.from(new Set(allProducts.map(p => p.brandName || 'Unknown').filter(Boolean)))

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brandName || 'Unknown')
      
      const matchesRating = product.rating >= minRating
      
      const matchesStock = !showOnlyInStock || (product.stock && product.stock > 0)
      
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
    setPriceRange([0, 100000])
    setSelectedBrands([])
    setMinRating(0)
    setShowOnlyInStock(false)
  }

  const hasActiveFilters = priceRange[0] > 0 || priceRange[1] < 100000 || selectedBrands.length > 0 || minRating > 0 || showOnlyInStock

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
      <Header />

      <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="py-3 sm:py-4 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 overflow-x-auto">
          <Link href="/" className="hover:text-[#26732d] transition-colors flex items-center gap-1 whitespace-nowrap" data-testid="link-home">
            <Home size={14} className="sm:w-4 sm:h-4" />
            <span>Home</span>
          </Link>
          <ChevronRight size={14} className="text-gray-400 flex-shrink-0 sm:w-4 sm:h-4" />
          <Link href="/products" className="hover:text-[#26732d] transition-colors whitespace-nowrap" data-testid="link-products">
            Products
          </Link>
          <ChevronRight size={14} className="text-gray-400 flex-shrink-0 sm:w-4 sm:h-4" />
          <span className="text-[#26732d] font-medium truncate">{categoryName}</span>
        </div>

        {/* Premium Category Header */}
        <div className="mb-6 sm:mb-8 bg-gradient-to-br from-[#26732d] via-[#2a7f32] to-[#1f5d26] rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-white shadow-2xl relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 sm:w-48 h-24 sm:h-48 bg-[#ffde59]/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl sm:text-4xl shadow-lg">
                {categoryInfo?.icon || '📦'}
              </div>
              <div className="flex-1 w-full sm:w-auto">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                    {categoryName}
                  </h1>
                  <Badge className="bg-[#ffde59] text-[#26732d] hover:bg-[#ffd73e] text-xs sm:text-sm font-semibold px-3 py-1 w-fit">
                    <Sparkles size={14} className="mr-1" />
                    {filteredProducts.length} Products
                  </Badge>
                </div>
                <p className="text-white/90 text-sm sm:text-base lg:text-lg leading-relaxed">
                  Discover our premium selection of {categoryName.toLowerCase()} products for your beloved pets
                </p>
              </div>
            </div>

            {/* Quick Stats - Enhanced Mobile Layout */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center gap-1.5 sm:gap-2 text-white/70 text-xs mb-1">
                  <Package size={14} className="sm:w-4 sm:h-4" />
                  <span className="truncate">Total Items</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold">{products.length}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center gap-1.5 sm:gap-2 text-white/70 text-xs mb-1">
                  <Star size={14} className="sm:w-4 sm:h-4" />
                  <span className="truncate">Avg Rating</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold">
                  {products.length > 0 ? (products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1) : '0'}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center gap-1.5 sm:gap-2 text-white/70 text-xs mb-1">
                  <TrendingUp size={14} className="sm:w-4 sm:h-4" />
                  <span className="truncate">Bestsellers</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold">
                  {products.filter(p => p.isBestseller).length}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center gap-1.5 sm:gap-2 text-white/70 text-xs mb-1">
                  <Tag size={14} className="sm:w-4 sm:h-4" />
                  <span className="truncate">New Arrivals</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold">
                  {products.filter(p => p.isNew).length}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 lg:gap-6">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
            <div className="sticky top-4 bg-white rounded-xl shadow-lg p-5 xl:p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-5 xl:mb-6">
                <h3 className="text-base xl:text-lg font-bold text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal size={18} className="xl:w-5 xl:h-5" />
                  Filters
                </h3>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 h-7"
                    data-testid="button-clear-filters"
                  >
                    Clear All
                  </Button>
                )}
              </div>

              <div className="space-y-5 xl:space-y-6">
                {/* Price Range */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">
                    Price Range
                  </label>
                  <Slider
                    min={0}
                    max={100000}
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
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        {allBrands.slice(0, 10).map((brand) => (
                          <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                            <Checkbox
                              checked={selectedBrands.includes(brand)}
                              onCheckedChange={() => toggleBrand(brand)}
                              data-testid={`checkbox-brand-${brand.toLowerCase().replace(/\s+/g, '-')}`}
                            />
                            <span className="text-sm text-black group-hover:text-[#26732d] transition-colors flex-1 truncate">
                              {brand}
                            </span>
                            <span className="text-xs text-gray-500">
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
                        <div className="flex items-center gap-1 flex-1">
                          {Array.from({ length: rating }).map((_, i) => (
                            <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="text-sm text-black group-hover:text-[#26732d]">& up</span>
                        </div>
                        <span className="text-xs text-gray-500">
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
                    <span className="text-sm font-semibold text-black group-hover:text-[#26732d] flex-1">
                      In Stock Only
                    </span>
                    <span className="text-xs text-gray-500">
                      ({products.filter(p => p.stock && p.stock > 0).length})
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Search and Controls - Enhanced Mobile */}
            <div className="flex flex-col gap-2.5 sm:gap-3 mb-4 sm:mb-6">
              {/* First Row: Search and Mobile Filter */}
              <div className="flex gap-2 sm:gap-3">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 sm:w-[18px] sm:h-[18px]" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 sm:pl-10 h-10 sm:h-11 border-gray-200 focus:border-[#26732d] focus:ring-[#26732d] text-sm text-black placeholder:text-gray-500"
                    data-testid="input-search"
                  />
                </div>

                {/* Mobile Filter Button */}
                <Button
                  variant="outline"
                  className="lg:hidden h-10 sm:h-11 gap-1.5 sm:gap-2 px-3 sm:px-4 flex-shrink-0 bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                  onClick={() => setShowFilters(!showFilters)}
                  data-testid="button-toggle-filters"
                >
                  <SlidersHorizontal size={16} className="sm:w-[18px] sm:h-[18px] text-gray-700" />
                  <span className="hidden xs:inline text-gray-900">Filters</span>
                  {hasActiveFilters && (
                    <Badge className="bg-[#26732d] text-white ml-0.5 sm:ml-1 h-5 min-w-[20px] px-1.5">{selectedBrands.length + (minRating > 0 ? 1 : 0) + (showOnlyInStock ? 1 : 0)}</Badge>
                  )}
                </Button>
              </div>

              {/* Second Row: Sort and View Mode */}
              <div className="flex gap-2 sm:gap-3">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="flex-1 sm:flex-none sm:w-56 h-10 sm:h-11 border-gray-200 text-sm text-black" data-testid="select-sort">
                    <SelectValue placeholder="Sort by" className="text-black" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="name" className="text-black">Name (A-Z)</SelectItem>
                    <SelectItem value="price-low" className="text-black">Price (Low to High)</SelectItem>
                    <SelectItem value="price-high" className="text-black">Price (High to Low)</SelectItem>
                    <SelectItem value="rating" className="text-black">Highest Rated</SelectItem>
                    <SelectItem value="reviews" className="text-black">Most Reviews</SelectItem>
                    <SelectItem value="newest" className="text-black">Newest First</SelectItem>
                  </SelectContent>
                </Select>

                
              </div>
            </div>

            {/* Mobile Filters - Enhanced */}
            {showFilters && (
              <div className="lg:hidden bg-white rounded-xl shadow-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-200 animate-slide-down">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                    <SlidersHorizontal size={18} className="sm:w-5 sm:h-5" />
                    Filters
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(false)}
                    className="h-8"
                    data-testid="button-close-filters"
                  >
                    <X size={18} className="sm:w-5 sm:h-5" />
                  </Button>
                </div>

                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="w-full mb-4 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    data-testid="button-clear-filters-mobile"
                  >
                    Clear All Filters
                  </Button>
                )}

                <div className="space-y-5">
                  {/* Mobile Price Range */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">
                      Price Range
                    </label>
                    <Slider
                      min={0}
                      max={100000}
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
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {allBrands.slice(0, 10).map((brand) => (
                            <label key={brand} className="flex items-center gap-2 cursor-pointer">
                              <Checkbox
                                checked={selectedBrands.includes(brand)}
                                onCheckedChange={() => toggleBrand(brand)}
                              />
                              <span className="text-sm text-gray-700 flex-1">{brand}</span>
                              <span className="text-xs text-gray-400">
                                ({products.filter(p => p.brandName === brand).length})
                              </span>
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
                          <div className="flex items-center gap-1 flex-1">
                            {Array.from({ length: rating }).map((_, i) => (
                              <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                            ))}
                            <span className="text-sm text-gray-600">& up</span>
                          </div>
                          <span className="text-xs text-gray-400">
                            ({products.filter(p => p.rating >= rating).length})
                          </span>
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
                      <span className="text-sm font-semibold text-gray-700 flex-1">
                        In Stock Only
                      </span>
                      <span className="text-xs text-gray-400">
                        ({products.filter(p => p.stockQuantity && p.stockQuantity > 0).length})
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-100">
                <span className="text-xs sm:text-sm font-medium text-gray-700">Active Filters:</span>
                {selectedBrands.map(brand => (
                  <Badge
                    key={brand}
                    variant="secondary"
                    className="bg-white border border-gray-200 text-gray-700 gap-1 text-xs hover:bg-gray-50 transition-colors"
                    data-testid={`badge-filter-${brand.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {brand}
                    <X
                      size={12}
                      className="cursor-pointer hover:text-red-600"
                      onClick={() => toggleBrand(brand)}
                    />
                  </Badge>
                ))}
                {minRating > 0 && (
                  <Badge variant="secondary" className="bg-white border border-gray-200 text-gray-700 gap-1 text-xs hover:bg-gray-50 transition-colors">
                    {minRating}+ Stars
                    <X
                      size={12}
                      className="cursor-pointer hover:text-red-600"
                      onClick={() => setMinRating(0)}
                    />
                  </Badge>
                )}
                {showOnlyInStock && (
                  <Badge variant="secondary" className="bg-white border border-gray-200 text-gray-700 gap-1 text-xs hover:bg-gray-50 transition-colors">
                    In Stock
                    <X
                      size={12}
                      className="cursor-pointer hover:text-red-600"
                      onClick={() => setShowOnlyInStock(false)}
                    />
                  </Badge>
                )}
              </div>
            )}

            {/* Products Grid/List */}
            {loading ? (
              <div className={cn(
                'grid gap-3 sm:gap-4 lg:gap-6',
                viewMode === 'grid' 
                  ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              )}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 animate-pulse">
                    <div className="bg-gray-200 h-32 sm:h-48 rounded-lg mb-3 sm:mb-4"></div>
                    <div className="bg-gray-200 h-3 sm:h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-3 sm:h-4 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 sm:py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={24} className="text-gray-400 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No products found</h3>
                <p className="text-sm sm:text-base text-gray-500 mb-6">
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
                  'grid gap-3 sm:gap-4 lg:gap-6',
                  viewMode === 'grid' 
                    ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                )}>
                  {filteredProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="animate-fade-in-up"
                      style={{ 
                        animationDelay: `${Math.min(index * 0.05, 0.5)}s`,
                        opacity: 0,
                        animation: `fadeInUp 0.6s ease-out ${Math.min(index * 0.05, 0.5)}s forwards`
                      }}
                      data-testid={`card-product-${product.id}`}
                    >
                      <ProductCard
                        product={product}
                        className={cn(
                          'shadow-md hover:shadow-2xl transition-all duration-300 border-0 h-full',
                          viewMode === 'list' && 'sm:flex sm:flex-row sm:h-auto'
                        )}
                      />
                    </div>
                  ))}
                </div>

                {/* Results Info */}
                <div className="mt-6 sm:mt-8 text-center">
                  <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white rounded-full shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <Package size={14} className="text-[#26732d] sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                      Showing <span className="text-[#26732d] font-bold">{filteredProducts.length}</span> of <span className="font-bold">{products.length}</span> products
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 sm:mt-16">
        <Footer />
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #26732d;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #1f5d26;
        }
        
        @media (min-width: 475px) {
          .xs\\:inline {
            display: inline;
          }
        }
      `}</style>
    </div>
  )
}
