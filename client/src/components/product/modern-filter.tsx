import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
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

export default function ModernFilter({ onFilterChange, maxPrice = 13000, className = '' }: ModernFilterProps) {
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
    <div className={`space-y-4 ${className}`}>
      {/* Sort Options */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ArrowUpDown className="h-4 w-4" />
            Sort By
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full text-black">
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
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-4 w-4" />
            Filter By Price
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>৳{priceRange[0]}</span>
            <span>৳{priceRange[1]}</span>
          </div>
        </CardContent>
      </Card>

      {/* Clear Filters */}
      <Button 
        variant="outline" 
        className="w-full text-gray-900 border-gray-400 bg-white hover:bg-gray-100 hover:border-gray-500 hover:text-black shadow-sm"
        onClick={resetFilters}
      >
        Clear Filters
      </Button>
    </div>
  );
}