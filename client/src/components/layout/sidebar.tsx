import { useState } from 'react';
import { Cat, Dog, Bone, SprayCan, Plus, Heart, Package, Stethoscope, Shirt, Gem, Crown, Gamepad2, ChevronRight } from 'lucide-react';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/contexts/sidebar-context';

export default function NavigationSidebar() {
  const { isVisible } = useSidebar();

  const categories = [
    { icon: Crown, label: 'Cat Food', href: '/cat-food', hasSubCategories: true },
    { icon: Dog, label: 'Dog Food', href: '/dog-food', hasSubCategories: true },
    { icon: Gamepad2, label: 'Cat Toys', href: '/cat-toys', hasSubCategories: false },
    { icon: Package, label: 'Cat Litter', href: '/cat-litter', hasSubCategories: true },
    { icon: Stethoscope, label: 'Cat Care & Health', href: '/cat-care', hasSubCategories: false },
    { icon: Shirt, label: 'Clothing, Beds & Carrier', href: '/cat-accessories', hasSubCategories: true },
    { icon: Gem, label: 'Cat Accessories', href: '/cat-accessories', hasSubCategories: true },
    { icon: Plus, label: 'Dog Health & Accessories', href: '/dog-accessories', hasSubCategories: true },
    { icon: Bone, label: 'Rabbit Food & Accessories', href: '/rabbit', hasSubCategories: true },
    { icon: SprayCan, label: 'Bird Food & Accessories', href: '/bird', hasSubCategories: true },
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed left-0 top-[120px] w-80 bg-white shadow-lg border-r border-gray-200 h-[calc(100vh-120px)] overflow-y-auto flex-shrink-0 z-30">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Categories</h2>
        <nav className="space-y-1">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link 
                key={category.label} 
                href={category.href}
                className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-[#26732d] rounded-lg transition-colors group"
              >
                <IconComponent className="w-5 h-5 mr-3 text-gray-500 group-hover:text-[#26732d]" />
                <span className="font-medium">{category.label}</span>
                {category.hasSubCategories && (
                  <ChevronRight className="w-4 h-4 ml-auto text-gray-400 group-hover:text-[#26732d]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}