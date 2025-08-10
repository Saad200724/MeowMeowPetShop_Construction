import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { categories, getProductsByCategory } from '@/lib/product-data'
import { Menu, X, Cat, Dog, Heart, Gift, ShoppingBag, Stethoscope, Gamepad2, Package, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CollapsibleSidebarProps {
  selectedCategory: string | null
  onCategorySelect: (categoryId: string) => void
}

const categoryIcons = {
  'cat-food': Cat,
  'dog-food': Dog,
  'cat-toys': Gamepad2,
  'cat-litter': Package,
  'toys-treats': Gift,
  'grooming': ShoppingBag,
  'health-care': Stethoscope,
  'accessories': Heart,
  'reflex': Star,
}

export default function CollapsibleSidebar({ selectedCategory, onCategorySelect }: CollapsibleSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        className="lg:hidden fixed top-4 left-4 z-50 bg-white shadow-lg"
        onClick={toggleSidebar}
      >
        {isCollapsed ? <Menu size={20} /> : <X size={20} />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          'fixed lg:relative left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40',
          isCollapsed ? 'w-0 lg:w-16 overflow-hidden' : 'w-64 lg:w-64',
          'lg:translate-x-0',
          isCollapsed && 'lg:overflow-visible'
        )}
      >
        {/* Desktop Toggle Button */}
        <div className="hidden lg:flex justify-end p-4 border-b border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="hover:bg-gray-100"
          >
            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
          </Button>
        </div>

        {/* Sidebar Content */}
        <div className={cn('h-full', isCollapsed && 'lg:hidden')}>
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-[#26732d]">Categories</h2>
          </div>

          <ScrollArea className="h-[calc(100vh-120px)]">
            <div className="p-4 space-y-2">
              {categories.map((category) => {
                const Icon = categoryIcons[category.id as keyof typeof categoryIcons]
                const productCount = getProductsByCategory(category.id).length
                const isSelected = selectedCategory === category.id

                return (
                  <Button
                    key={category.id}
                    variant={isSelected ? "meow" : "ghost"}
                    className={cn(
                      'w-full justify-start text-left h-auto p-3 hover:bg-[#f0f8ff] transition-colors',
                      isSelected && 'bg-[#ffde59] text-[#26732d] hover:bg-[#ffd73e]'
                    )}
                    onClick={() => onCategorySelect(category.id)}
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <Icon size={20} className={isSelected ? 'text-[#26732d]' : 'text-gray-600'} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{category.name}</div>
                        <div className="flex items-center mt-1 space-x-2">
                          <Badge 
                            variant="secondary" 
                            className={cn(
                              'text-xs',
                              isSelected ? 'bg-[#26732d] text-white' : 'bg-gray-100 text-gray-600'
                            )}
                          >
                            {productCount} items
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Collapsed Mini Icons */}
        {isCollapsed && (
          <div className="hidden lg:block absolute left-0 top-20 w-16 bg-white border-r border-gray-200">
            <div className="py-4 space-y-2">
              {categories.map((category) => {
                const Icon = categoryIcons[category.id as keyof typeof categoryIcons]
                const isSelected = selectedCategory === category.id

                return (
                  <Button
                    key={category.id}
                    variant={isSelected ? "meow" : "ghost"}
                    size="sm"
                    className={cn(
                      'w-12 h-12 mx-2 p-0 hover:bg-[#f0f8ff]',
                      isSelected && 'bg-[#ffde59] text-[#26732d] hover:bg-[#ffd73e]'
                    )}
                    onClick={() => onCategorySelect(category.id)}
                    title={category.name}
                  >
                    <Icon size={20} />
                  </Button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}
    </>
  )
}