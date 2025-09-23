import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Filter, ArrowUpDown } from 'lucide-react';

export interface FilterOptions {
  priceRange: [number, number];
  sortBy: string;
}

interface ModernFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  maxPrice?: number;
  className?: string;
}

export default function ModernFilter({ onFilterChange, maxPrice = 20000, className = '' }: ModernFilterProps) {
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

  return (
    <div className={`space-y-1 md:space-y-2 ${className}`}>
      {/* Sort Options */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-1 md:pb-1 py-1 md:py-2">
          <CardTitle className="flex items-center gap-1 text-xs md:text-sm font-medium">
            <ArrowUpDown className="h-2.5 w-2.5 md:h-3 md:w-3" />
            Sort By
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-1 md:pb-2">
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full text-black h-8 md:h-9 text-xs md:text-sm">
              <SelectValue placeholder="Sort by relevance" className="text-black" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="relevance" className="text-black hover:bg-gray-100">Sort By Relevance</SelectItem>
              <SelectItem value="latest" className="text-black hover:bg-gray-100">Latest</SelectItem>
              <SelectItem value="a-z" className="text-black hover:bg-gray-100">A-Z Order</SelectItem>
              <SelectItem value="z-a" className="text-black hover:bg-gray-100">Z-A Order</SelectItem>
              <SelectItem value="price-high-low" className="text-black hover:bg-gray-100">Price: high to low</SelectItem>
              <SelectItem value="price-low-high" className="text-black hover:bg-gray-100">Price: low to high</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Price Filter */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-1 md:pb-1 py-1 md:py-2">
          <CardTitle className="flex items-center gap-1 text-xs md:text-sm font-medium">
            <Filter className="h-2.5 w-2.5 md:h-3 md:w-3" />
            Filter By Price
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 md:space-y-2 pt-0 pb-1 md:pb-2">
          <div className="px-1 md:px-2">
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              max={maxPrice}
              min={1}
              step={50}
              className="w-full"
            />
          </div>
          <div className="flex justify-between items-center gap-0.5 md:gap-2 mt-1 md:mt-3">
            <div className="flex items-center gap-0.5">
              <span className="text-xs md:text-sm text-gray-600">৳</span>
              <Input
                type="number"
                value={priceRange[0]}
                onChange={(e) => {
                  const value = Math.max(1, parseInt(e.target.value) || 1);
                  const newRange: [number, number] = [value, Math.max(value, priceRange[1])];
                  setPriceRange(newRange);
                  onFilterChange({ priceRange: newRange, sortBy });
                }}
                className="w-12 md:w-24 h-6 md:h-10 text-xs md:text-sm px-1 md:px-2"
                min="1"
                max={maxPrice}
              />
            </div>
            <span className="text-xs md:text-sm text-gray-400">to</span>
            <div className="flex items-center gap-0.5">
              <span className="text-xs md:text-sm text-gray-600">৳</span>
              <Input
                type="number"
                value={priceRange[1]}
                onChange={(e) => {
                  const value = Math.min(maxPrice, parseInt(e.target.value) || maxPrice);
                  const newRange: [number, number] = [Math.min(priceRange[0], value), value];
                  setPriceRange(newRange);
                  onFilterChange({ priceRange: newRange, sortBy });
                }}
                className="w-14 md:w-28 h-6 md:h-10 text-xs md:text-sm px-1 md:px-2"
                min="1"
                max={maxPrice}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clear Filters */}
      <Button 
        variant="outline" 
        className="w-28 md:w-36 text-xs md:text-sm py-1 md:py-1.5 h-7 md:h-8 text-gray-900 border-gray-400 bg-white hover:bg-gray-100 hover:border-gray-500 hover:text-black shadow-sm"
        onClick={resetFilters}
      >
        Clear Filters
      </Button>
    </div>
  );
}