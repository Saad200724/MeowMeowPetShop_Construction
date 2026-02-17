import { useState, useEffect } from 'react';
import { X, Cat, Dog, Rabbit, Bird, Package, Stethoscope, Shirt, Gem, Bone, Gamepad2, ChevronRight, Facebook, Instagram, Twitter, Youtube, Linkedin, Pill, ShoppingBag } from 'lucide-react';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/contexts/sidebar-context';

const logoPath = '/logo.png';

export default function NavigationSidebar() {
  const { isVisible, setIsVisible, isHomePage } = useSidebar();

  // Mobile categories (simple list)
  const mobileCategories = [
    { label: 'Cat Food', href: '/cat-food' },
    { label: 'Dog Food', href: '/dog-food' },
    { label: 'Cat Toys', href: '/cat-toys' },
    { label: 'Cat Litter', href: '/cat-litter' },
    { label: 'Cat Care & Health', href: '/cat-care' },
    { label: 'Clothing, Beds & Carrier', href: '/clothing-beds-carrier' },
    { label: 'Cat Accessories', href: '/cat-accessories' },
    { label: 'Dog Health & Accessories', href: '/dog-accessories' },
    { label: 'Rabbit Food & Accessories', href: '/rabbit' },
    { label: 'Bird Food & Accessories', href: '/bird' },
  ];

  // Desktop categories (with icons and subcategories)
  const desktopCategories = [
    { 
      icon: Cat, 
      label: 'Cat Food', 
      href: '/cat-food', 
      hasSubCategories: true,
      subCategories: [
        { label: 'Cat Food', href: '/cat-food' },
        { label: 'Kitten Dry Food', href: '/subcategory/kitten-dry-food' },
        { label: 'Adult Dry Food', href: '/subcategory/adult-dry-food' },
        { label: 'Kitten Wet Food', href: '/subcategory/kitten-wet-food' },
        { label: 'Adult Wet Food', href: '/subcategory/adult-wet-food' },
      ]
    },
    { icon: Dog, label: 'Dog Food', href: '/dog-food', hasSubCategories: false },
    { icon: Gamepad2, label: 'Cat Toys', href: '/cat-toys', hasSubCategories: false },
    { icon: Package, label: 'Cat Litter', href: '/cat-litter', hasSubCategories: false },
    { icon: Stethoscope, label: 'Cat Care & Health', href: '/cat-care', hasSubCategories: false },
    { icon: Shirt, label: 'Clothing, Beds & Carrier', href: '/clothing-beds-carrier', hasSubCategories: false },
    { icon: Gem, label: 'Cat Accessories', href: '/cat-accessories', hasSubCategories: false },
    { icon: Bone, label: 'Dog Health & Accessories', href: '/dog-accessories', hasSubCategories: false },
    { icon: Rabbit, label: 'Rabbit Food & Accessories', href: '/rabbit', hasSubCategories: false },
    { icon: Bird, label: 'Bird Food & Accessories', href: '/bird', hasSubCategories: false },
  ];

  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const handleCloseSidebar = () => {
    setIsVisible(false);
    setExpandedCategory(null);
  };

  const handleBackdropClick = () => {
    if (!isHomePage) {
      setIsVisible(false);
      setExpandedCategory(null);
    }
  };

  const handleSidebarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const toggleCategory = (e: React.MouseEvent, label: string) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedCategory(expandedCategory === label ? null : label);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Mobile Sidebar (md and below) */}
      <div className="md:hidden">
        {/* Backdrop overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[1100]" 
          onClick={handleBackdropClick}
        />
        
        {/* Mobile Sidebar */}
        <div 
          className={cn(
            "fixed left-0 top-0 w-80 max-w-[85vw] h-full bg-white shadow-2xl z-[1101] transform transition-transform duration-300 ease-in-out",
            isVisible ? "translate-x-0" : "-translate-x-full"
          )}
          onClick={handleSidebarClick}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <img src={logoPath} alt="Meow Meow Logo" className="w-8 h-8" />
                <span className="text-sm text-gray-600">Browse Menu</span>
              </div>
              <button
                onClick={handleCloseSidebar}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                data-testid="close-sidebar-button"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Categories */}
            <div className="flex-1 overflow-y-auto">
              <div className="py-2">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-800">Categories</h3>
                </div>
                
                <nav className="space-y-0">
                  {mobileCategories.map((category) => (
                    <Link 
                      key={category.label} 
                      href={category.href}
                      onClick={handleCloseSidebar}
                    >
                      <div className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 border-b border-gray-50 transition-colors cursor-pointer">
                        <span className="text-sm font-medium">{category.label}</span>
                      </div>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4 space-y-4">
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="text-xs text-gray-600">Our Hotline</div>
                <div className="text-sm font-medium text-gray-800">Live For App Up</div>
                <div className="text-sm text-gray-600">01 4050-45-023</div>
              </div>

              {/* Social Media */}
              <div className="space-y-2">
                <div className="text-xs text-gray-600">Follow Us</div>
                <div className="flex items-center gap-3">
                  <a href="https://facebook.com/meow.meow.pet.shop1" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    <Facebook size={16} className="text-gray-600" />
                  </a>
                  <a href="https://www.instagram.com/meow_meow_pet_shop" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    <Instagram size={16} className="text-gray-600" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar (md and above) */}
      <div className="hidden md:block">
        {/* Backdrop overlay for non-home pages */}
        {!isHomePage && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40" 
            onClick={handleBackdropClick}
          />
        )}
        
        {/* Desktop Sidebar */}
        <div className={cn(
          "fixed left-0 top-[120px] w-80 bg-white shadow-lg border-r border-gray-200 h-[calc(100vh-120px)] overflow-y-scroll scrollbar-hide flex-shrink-0",
          isHomePage ? "z-10" : "z-50"
        )}>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Categories</h2>
            <nav className="space-y-1">
              {desktopCategories.map((category) => {
                const IconComponent = category.icon;
                const isExpanded = expandedCategory === category.label;
                const hasSub = category.hasSubCategories && category.subCategories;
                
                return (
                  <div key={category.label}>
                    <div className="group relative flex items-center">
                      <Link 
                        href={category.href}
                        className="flex-1 flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-[#26732d] rounded-lg transition-colors group"
                        onClick={() => !hasSub && handleCloseSidebar()}
                      >
                        <IconComponent className="w-5 h-5 mr-3 text-gray-500 group-hover:text-[#26732d]" />
                        <span className="font-medium">{category.label}</span>
                      </Link>
                      {hasSub && (
                        <button
                          onClick={(e) => toggleCategory(e, category.label)}
                          className="p-2 ml-auto text-gray-400 hover:text-[#26732d] transition-colors"
                        >
                          <ChevronRight className={cn(
                            "w-4 h-4 transition-transform duration-200",
                            isExpanded && "rotate-90"
                          )} />
                        </button>
                      )}
                    </div>
                    
                    {hasSub && isExpanded && (
                      <div className="ml-8 mt-1 space-y-1 border-l-2 border-gray-100 pl-4">
                        {category.subCategories.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            className="block px-3 py-2 text-sm text-gray-600 hover:text-[#26732d] hover:bg-gray-50 rounded-md transition-colors"
                            onClick={handleCloseSidebar}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}