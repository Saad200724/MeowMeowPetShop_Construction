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
import { useQuery } from '@tanstack/react-query'
import { setSEO } from '@/lib/seo'
import { SlidersHorizontal, ChevronRight, Home, Package, Star, TrendingUp, Tag, Sparkles, Search } from 'lucide-react'
import { Link } from 'wouter'
import { cn } from "@/lib/utils"

interface SubcategoryPageProps {
  subcategoryId: string;
  subcategoryName: string;
  icon?: string;
}

interface Brand {
  _id: string;
  id: string;
  name: string;
}

export default function SubcategoryPage({ subcategoryId, subcategoryName, icon = '📦' }: SubcategoryPageProps) {
  useEffect(() => {
    setSEO({
      title: `${subcategoryName} - Pet Shop | Meow Meow`,
      description: `Discover our premium selection of ${subcategoryName.toLowerCase()} products for your beloved pets.`,
      canonical: `https://meowshopbd.me/subcategory/${subcategoryId}`,
    });
  }, [subcategoryId, subcategoryName]);

  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [minRating, setMinRating] = useState(0)
  const [showOnlyInStock, setShowOnlyInStock] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  
  const { loading, getProductsByCategory } = useProducts()
  
  // Fetch brands from API to ensure we have all brands, not just those with products in this category
  const { data: brands = [] } = useQuery<Brand[]>({
    queryKey: ['/api/brands'],
  })

  const products = getProductsByCategory(subcategoryId)

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
        case 'price-low': return a.price - b.price
        case 'price-high': return b.price - a.price
        case 'rating': return b.rating - a.rating
        case 'name': return a.name.localeCompare(b.name)
        default: return 0
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#26732d]"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
      <Header />

      <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8 pb-12">
        {/* Breadcrumb Navigation */}
        <div className="py-3 sm:py-4 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 overflow-x-auto">
          <Link href="/" className="hover:text-[#26732d] transition-colors flex items-center gap-1 whitespace-nowrap">
            <Home size={14} className="sm:w-4 sm:h-4" />
            <span>Home</span>
          </Link>
          <ChevronRight size={14} className="text-gray-400 flex-shrink-0 sm:w-4 sm:h-4" />
          <span className="text-[#26732d] font-medium truncate">{subcategoryName}</span>
        </div>

        {/* Premium Category Header */}
        <div className="mb-6 sm:mb-8 bg-[#26732d] rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl sm:text-4xl shadow-lg">
                {icon}
              </div>
              <div className="flex-1 w-full sm:w-auto">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                    {subcategoryName}
                  </h1>
                  <Badge className="bg-[#ffde59] text-[#26732d] hover:bg-[#ffd73e] text-xs sm:text-sm font-semibold px-3 py-1 w-fit">
                    <Sparkles size={14} className="mr-1" />
                    {filteredProducts.length} Products
                  </Badge>
                </div>
                <p className="text-white/90 text-sm sm:text-base lg:text-lg leading-relaxed">
                  Discover our premium selection of {subcategoryName.toLowerCase()} products for your beloved pets
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
                <div className="flex items-center gap-1.5 sm:gap-2 text-white/70 text-xs mb-1">
                  <Package size={14} />
                  <span>Total Items</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold">{products.length}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
                <div className="flex items-center gap-1.5 sm:gap-2 text-white/70 text-xs mb-1">
                  <Star size={14} />
                  <span>Avg Rating</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold">
                  {products.length > 0 ? (products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1) : '0.0'}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
                <div className="flex items-center gap-1.5 sm:gap-2 text-white/70 text-xs mb-1">
                  <TrendingUp size={14} />
                  <span>Bestsellers</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold">
                  {products.filter(p => p.isBestSeller).length}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
                <div className="flex items-center gap-1.5 sm:gap-2 text-white/70 text-xs mb-1">
                  <Tag size={14} />
                  <span>New Arrivals</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold">
                  {products.filter(p => p.isNew).length}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
            <div className="sticky top-4 bg-white rounded-xl shadow-lg p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal size={18} />
                  Filters
                </h3>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-white hover:text-white/80 h-7 bg-red-500 hover:bg-red-600 rounded-full px-3">
                    Clear All
                  </Button>
                )}
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Price Range</label>
                  <Slider min={0} max={100000} step={100} value={priceRange} onValueChange={setPriceRange} className="mb-3" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>৳{priceRange[0]}</span>
                    <span>৳{priceRange[1]}</span>
                  </div>
                </div>
                <Separator />
                {brands.length > 0 && (
                  <>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-3 block">Brands</label>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        {brands.map(brand => (
                          <label key={brand._id} className="flex items-center gap-2 cursor-pointer group">
                            <Checkbox checked={selectedBrands.includes(brand.name)} onCheckedChange={() => toggleBrand(brand.name)} />
                            <span className="text-sm text-gray-800 group-hover:text-[#26732d] flex-1 truncate">{brand.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <Separator />
                  </>
                )}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Minimum Rating</label>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map(rating => (
                      <label key={rating} className="flex items-center gap-2 cursor-pointer group">
                        <Checkbox checked={minRating === rating} onCheckedChange={(checked) => setMinRating(checked ? rating : 0)} />
                        <div className="flex items-center gap-1 flex-1">
                          {Array.from({ length: rating }).map((_, i) => <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />)}
                          <span className="text-sm text-gray-800 group-hover:text-[#26732d]">& up</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <Separator />
                <label className="flex items-center gap-2 cursor-pointer group">
                  <Checkbox checked={showOnlyInStock} onCheckedChange={(checked) => setShowOnlyInStock(checked === true)} />
                  <span className="text-sm font-semibold text-gray-800 group-hover:text-[#26732d] flex-1">In Stock Only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex gap-3">
                <div className="relative flex-1 group">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#26732d] transition-colors" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11 border-gray-200 focus:border-[#26732d] focus:ring-[#26732d]/20 text-gray-900 placeholder:text-gray-400 font-medium"
                  />
                </div>
                <Button 
                  variant="default" 
                  className="lg:hidden h-11 px-4 bg-[#26732d] hover:bg-[#26732d] !text-white border-none rounded-lg active:scale-95 transition-all shadow-sm" 
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal size={18} className="mr-2" />
                  <span className="font-bold">Filters</span>
                </Button>
              </div>

              {/* Mobile Filters Dropdown */}
              <div className={cn(
                "lg:hidden overflow-hidden transition-all duration-300 ease-in-out",
                showFilters ? "max-h-[1000px] mb-6 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
              )}>
                <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100 mt-2">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                      <SlidersHorizontal size={18} className="text-[#26732d]" />
                      Filters
                    </h3>
                    {hasActiveFilters && (
                      <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-white hover:text-white/80 h-7 bg-red-500 hover:bg-red-600 rounded-full px-3">
                        Clear All
                      </Button>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-4 block">Price Range</label>
                      <Slider min={0} max={100000} step={100} value={priceRange} onValueChange={setPriceRange} className="mb-4" />
                      <div className="flex justify-between text-sm text-gray-600 font-medium">
                        <span className="bg-gray-50 px-2 py-1 rounded">৳{priceRange[0]}</span>
                        <span className="bg-gray-50 px-2 py-1 rounded">৳{priceRange[1]}</span>
                      </div>
                    </div>
                    <Separator />
                    {brands.length > 0 && (
                      <>
                        <div>
                          <label className="text-sm font-semibold text-gray-700 mb-4 block">Brands</label>
                          <div className="grid grid-cols-2 gap-3">
                            {brands.map(brand => (
                              <label key={brand._id} className="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-gray-100 bg-gray-50/50 active:bg-green-50 active:border-green-200 transition-colors">
                                <Checkbox checked={selectedBrands.includes(brand.name)} onCheckedChange={() => toggleBrand(brand.name)} />
                                <span className="text-xs text-gray-800 font-medium truncate">{brand.name}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <Separator />
                      </>
                    )}
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-4 block">Minimum Rating</label>
                      <div className="grid grid-cols-2 gap-3">
                        {[4, 3, 2, 1].map(rating => (
                          <label key={rating} className="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-gray-100 bg-gray-50/50 active:bg-green-50 active:border-green-200 transition-colors">
                            <Checkbox checked={minRating === rating} onCheckedChange={(checked) => setMinRating(checked ? rating : 0)} />
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-bold text-gray-800">{rating}</span>
                              <Star size={12} className="fill-yellow-400 text-yellow-400" />
                              <span className="text-[10px] text-gray-500 font-medium">& up</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                    <Separator />
                    <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-gray-100 bg-gray-50/50 active:bg-green-50 active:border-green-200 transition-colors">
                      <Checkbox checked={showOnlyInStock} onCheckedChange={(checked) => setShowOnlyInStock(checked === true)} />
                      <span className="text-sm font-bold text-gray-800">In Stock Only</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-500 whitespace-nowrap">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-64 h-11 border-gray-200 bg-white hover:border-[#26732d] transition-colors font-medium text-gray-900">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-100 shadow-xl rounded-xl p-1">
                    <SelectItem value="name" className="rounded-lg focus:bg-green-50 focus:text-[#26732d] font-medium py-2.5">Name (A-Z)</SelectItem>
                    <SelectItem value="price-low" className="rounded-lg focus:bg-green-50 focus:text-[#26732d] font-medium py-2.5">Price (Low to High)</SelectItem>
                    <SelectItem value="price-high" className="rounded-lg focus:bg-green-50 focus:text-[#26732d] font-medium py-2.5">Price (High to Low)</SelectItem>
                    <SelectItem value="rating" className="rounded-lg focus:bg-green-50 focus:text-[#26732d] font-medium py-2.5">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-6 px-0 md:px-0">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length > 0 && (
              <div className="mt-8 flex justify-center">
                <div className="bg-white px-6 py-3 rounded-full shadow-md border border-gray-100 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                    <Package size={18} className="text-[#26732d]" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    Showing <span className="text-[#26732d] font-bold">{filteredProducts.length}</span> of <span className="font-bold">{products.length}</span> products
                  </span>
                </div>
              </div>
            )}

            {filteredProducts.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100 mt-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={32} className="text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search terms to find what you're looking for.</p>
                <Button 
                  variant="default" 
                  className="bg-[#26732d] hover:bg-[#1e5d26] !text-white rounded-full px-8 shadow-sm font-bold" 
                  onClick={clearFilters}
                >
                  <span className="text-white">Clear All Filters</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
