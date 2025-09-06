import { X, Cat, Dog, Rabbit, Bird, Package, Stethoscope, Shirt, Gem, Bone, Gamepad2, Facebook, Instagram, Twitter, Youtube, Linkedin } from 'lucide-react';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/contexts/sidebar-context';

const logoPath = '/logo.png';

export default function NavigationSidebar() {
  const { isVisible, setIsVisible } = useSidebar();

  const categories = [
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

  const handleCloseSidebar = () => {
    setIsVisible(false);
  };

  const handleBackdropClick = () => {
    setIsVisible(false);
  };

  const handleSidebarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-[1000]" 
        onClick={handleBackdropClick}
      />
      
      {/* Mobile Sidebar */}
      <div 
        className={cn(
          "fixed left-0 top-0 w-80 max-w-[85vw] h-full bg-white shadow-2xl z-[1001] transform transition-transform duration-300 ease-in-out",
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
                {categories.map((category) => (
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
                <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <Instagram size={16} className="text-gray-600" />
                </a>
                <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <Twitter size={16} className="text-gray-600" />
                </a>
                <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <Youtube size={16} className="text-gray-600" />
                </a>
                <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <Linkedin size={16} className="text-gray-600" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}