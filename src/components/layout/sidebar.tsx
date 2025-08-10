
import { useState } from 'react';
import { Cat, Dog, Bone, SprayCan, Plus, Heart, Menu, X, Crown, Gamepad2, Package, Stethoscope, Shirt, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const categories = [
    { icon: Crown, label: 'Cat Food', href: '#' },
    { icon: Gamepad2, label: 'Cat Toys', href: '#' },
    { icon: Package, label: 'Cat Litter', href: '#' },
    { icon: Stethoscope, label: 'Cat Care & Health', href: '#' },
    { icon: Shirt, label: 'Clothing, Beds & Carrier', href: '#' },
    { icon: Gem, label: 'Cat Accessories', href: '#' },
    { icon: Dog, label: 'Dog Food', href: '#' },
    { icon: Plus, label: 'Dog Health & Accessories', href: '#' },
    { icon: Bone, label: 'Rabbit Food & Accessories', href: '#' },
    { icon: SprayCan, label: 'Bird Food & Accessories', href: '#' },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={cn(
      'bg-white shadow-lg min-h-screen transition-all duration-300 ease-in-out',
      'hidden lg:block',
      isCollapsed ? 'w-16' : 'w-64'
    )}>
      <div className="p-4">
        {/* Toggle Button */}
        <div className="flex justify-between items-center mb-4">
          {!isCollapsed && (
            <h3 className="font-bold text-meow-green">Categories</h3>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="hover:bg-gray-100 p-2"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <Menu size={16} /> : <X size={16} />}
          </Button>
        </div>

        {/* Categories List */}
        <ul className="space-y-2">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <li key={index}>
                <a 
                  href={category.href} 
                  className={cn(
                    "flex items-center py-2 px-3 text-gray-700 hover:bg-yellow-50 hover:text-meow-green rounded transition-colors",
                    isCollapsed && "justify-center px-2"
                  )}
                  title={isCollapsed ? category.label : undefined}
                >
                  <IconComponent size={16} className={cn(
                    "text-meow-green",
                    isCollapsed ? "mr-0" : "mr-3"
                  )} />
                  {!isCollapsed && (
                    <span className="transition-opacity duration-300">
                      {category.label}
                    </span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Special Offers Box - Only show when expanded */}
        {!isCollapsed && (
          <div className="mt-8 meow-yellow p-4 rounded-lg transition-all duration-300">
            <h4 className="font-bold text-meow-green mb-2">Special Offer!</h4>
            <p className="text-sm text-gray-700 mb-3">Get 5% off on your first order</p>
            <Button className="meow-green text-white px-4 py-2 rounded text-sm hover-meow-green w-full">
              Claim Now
            </Button>
          </div>
        )}

        {/* Collapsed Special Offer Icon */}
        {isCollapsed && (
          <div className="mt-8 flex justify-center">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-yellow-500 transition-colors" title="Special Offer Available">
              <span className="text-xs font-bold text-green-700">%</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
