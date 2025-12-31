import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Filter, ArrowUpDown, X } from 'lucide-react';

export interface FilterOptions {
  priceRange: [number, number];
  sortBy: string;
}

interface ModernFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  maxPrice?: number;
  className?: string;
}

export default function ModernFilter({ onFilterChange, maxPrice = 100000, className = '' }: ModernFilterProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([1, maxPrice]);
  const [sortBy, setSortBy] = useState('relevance');

  const handlePriceChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    setPriceRange(newRange);
    onFilterChange({ priceRange: newRange, sortBy });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    onFilterChange({ priceRange, sortBy: value });
  };

  const resetFilters = () => {
    const defaultRange: [number, number] = [1, maxPrice];
    setPriceRange(defaultRange);
    setSortBy('relevance');
    onFilterChange({ priceRange: defaultRange, sortBy: 'relevance' });
  };

  const getSortDisplayName = (value: string) => {
    const sortNames = {
      'relevance': 'Relevance',
      'latest': 'Latest',
      'a-z': 'A-Z',
      'z-a': 'Z-A',
      'price-high-low': 'Price: High to Low',
      'price-low-high': 'Price: Low to High'
    };
    return sortNames[value as keyof typeof sortNames] || 'Relevance';
  };

  const hasActiveFilters = priceRange[0] !== 1 || priceRange[1] !== maxPrice || sortBy !== 'relevance';
  const hasActivePriceFilter = priceRange[0] !== 1 || priceRange[1] !== maxPrice;
  const hasActiveSortFilter = sortBy !== 'relevance';

  return (
    <div className={`space-y-3 md:space-y-4 ${className}`}>
      {/* Mobile: Pill-style filter triggers */}
      <div className="flex gap-2 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              className="flex-1 h-11 rounded-full text-sm font-medium border-gray-300 bg-white hover:bg-gray-100 hover:text-gray-900 shadow-sm text-gray-900"
              data-testid="button-price-filter"
            >
              <Filter className="h-4 w-4 mr-2 text-gray-700" />
              Price Filter
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[350px] bg-white">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 text-gray-900">
                <Filter className="h-5 w-5 text-gray-700" />
                Filter By Price
              </SheetTitle>
            </SheetHeader>
            <div className="space-y-6 mt-6">
              <div className="px-2">
                <Slider
                  value={priceRange}
                  onValueChange={handlePriceChange}
                  max={maxPrice}
                  min={1}
                  step={50}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-900 font-medium">৳</span>
                  <Input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => {
                      const value = Math.max(1, parseInt(e.target.value) || 1);
                      const newRange: [number, number] = [value, Math.max(value, priceRange[1])];
                      setPriceRange(newRange);
                      onFilterChange({ priceRange: newRange, sortBy });
                    }}
                    className="w-24 h-11 text-sm px-3 rounded-lg bg-white text-gray-900 border-gray-300"
                    min="1"
                    max={maxPrice}
                  />
                </div>
                <span className="text-sm text-gray-700 font-medium">to</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-900 font-medium">৳</span>
                  <Input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => {
                      const value = Math.min(maxPrice, parseInt(e.target.value) || maxPrice);
                      const newRange: [number, number] = [Math.min(priceRange[0], value), value];
                      setPriceRange(newRange);
                      onFilterChange({ priceRange: newRange, sortBy });
                    }}
                    className="w-28 h-11 text-sm px-3 rounded-lg bg-white text-gray-900 border-gray-300"
                    min="1"
                    max={maxPrice}
                  />
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              className="flex-1 h-11 rounded-full text-sm font-medium border-gray-300 bg-white hover:bg-gray-100 hover:text-gray-900 shadow-sm text-gray-900"
              data-testid="button-sort-filter"
            >
              <ArrowUpDown className="h-4 w-4 mr-2 text-gray-700" />
              Sort
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[300px] bg-white">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 text-gray-900">
                <ArrowUpDown className="h-5 w-5 text-gray-700" />
                Sort Options
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full h-12 text-sm rounded-lg bg-white text-gray-900 border-gray-300">
                  <SelectValue placeholder="Sort by relevance" className="text-gray-900" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="relevance" className="text-gray-900 hover:bg-gray-100">Sort By Relevance</SelectItem>
                  <SelectItem value="latest" className="text-gray-900 hover:bg-gray-100">Latest</SelectItem>
                  <SelectItem value="a-z" className="text-gray-900 hover:bg-gray-100">A-Z Order</SelectItem>
                  <SelectItem value="z-a" className="text-gray-900 hover:bg-gray-100">Z-A Order</SelectItem>
                  <SelectItem value="price-high-low" className="text-gray-900 hover:bg-gray-100">Price: High to Low</SelectItem>
                  <SelectItem value="price-low-high" className="text-gray-900 hover:bg-gray-100">Price: Low to High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Applied Filters - Shows active filters as removable chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {hasActivePriceFilter && (
            <Badge 
              variant="secondary" 
              className="bg-orange-100 text-orange-800 hover:bg-orange-200 cursor-pointer px-3 py-1 rounded-full text-xs font-medium"
              onClick={() => {
                const defaultRange: [number, number] = [1, maxPrice];
                setPriceRange(defaultRange);
                onFilterChange({ priceRange: defaultRange, sortBy });
              }}
            >
              ৳{priceRange[0]} - ৳{priceRange[1]}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          )}
          {hasActiveSortFilter && (
            <Badge 
              variant="secondary" 
              className="bg-orange-100 text-orange-800 hover:bg-orange-200 cursor-pointer px-3 py-1 rounded-full text-xs font-medium"
              onClick={() => {
                setSortBy('relevance');
                onFilterChange({ priceRange, sortBy: 'relevance' });
              }}
            >
              {getSortDisplayName(sortBy)}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          )}
        </div>
      )}

      {/* Desktop: Enhanced card layout */}
      <div className="hidden md:block space-y-4">
        {/* Price Filter Card */}
        <Card className="bg-white shadow rounded-xl border" data-testid="card-price-filter">
          <CardHeader className="border-b py-3">
            <CardTitle className="flex items-center gap-2 text-sm md:text-base font-medium">
              <Filter className="h-4 w-4 md:h-5 md:w-5" />
              Filter By Price
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4 pb-4">
            <div className="px-2">
              <Slider
                value={priceRange}
                onValueChange={handlePriceChange}
                max={maxPrice}
                min={1}
                step={50}
                className="w-full"
              />
            </div>
            <div className="flex justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">৳</span>
                <Input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => {
                    const value = Math.max(1, parseInt(e.target.value) || 1);
                    const newRange: [number, number] = [value, Math.max(value, priceRange[1])];
                    setPriceRange(newRange);
                    onFilterChange({ priceRange: newRange, sortBy });
                  }}
                  className="w-24 h-11 text-sm px-3"
                  min="1"
                  max={maxPrice}
                />
              </div>
              <span className="text-sm text-gray-400">to</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">৳</span>
                <Input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => {
                    const value = Math.min(maxPrice, parseInt(e.target.value) || maxPrice);
                    const newRange: [number, number] = [Math.min(priceRange[0], value), value];
                    setPriceRange(newRange);
                    onFilterChange({ priceRange: newRange, sortBy });
                  }}
                  className="w-28 h-11 text-sm px-3"
                  min="1"
                  max={maxPrice}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sort Options Card */}
        <Card className="bg-white shadow rounded-xl border" data-testid="card-sort-options">
          <CardHeader className="border-b py-3">
            <CardTitle className="flex items-center gap-2 text-sm md:text-base font-medium">
              <ArrowUpDown className="h-4 w-4 md:h-5 md:w-5" />
              Sort By
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 pb-4">
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full h-11 text-sm">
                <SelectValue placeholder="Sort by relevance" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="relevance">Sort By Relevance</SelectItem>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="a-z">A-Z Order</SelectItem>
                <SelectItem value="z-a">Z-A Order</SelectItem>
                <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                <SelectItem value="price-low-high">Price: Low to High</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Clear Filters - Only show when filters are active */}
      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          className="w-full h-11 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          onClick={resetFilters}
          data-testid="button-clear-filters"
        >
          <X className="h-4 w-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );
}