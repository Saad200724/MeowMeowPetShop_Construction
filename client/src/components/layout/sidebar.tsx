import { Cat, Dog, Bone, SprayCan, Plus, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Sidebar() {
  const categories = [
    { icon: Cat, label: 'Cat Food', href: '#' },
    { icon: Dog, label: 'Dog Food', href: '#' },
    { icon: Bone, label: 'Toys & Treats', href: '#' },
    { icon: SprayCan, label: 'Grooming', href: '#' },
    { icon: Plus, label: 'Health Care', href: '#' },
    { icon: Heart, label: 'Accessories', href: '#' },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg min-h-screen hidden lg:block">
      <div className="p-4">
        <h3 className="font-bold text-meow-green mb-4">Categories</h3>
        <ul className="space-y-2">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <li key={index}>
                <a 
                  href={category.href} 
                  className="flex items-center py-2 px-3 text-gray-700 hover:bg-yellow-50 hover:text-meow-green rounded transition-colors"
                >
                  <IconComponent size={16} className="mr-3 text-meow-green" />
                  {category.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Special Offers Box */}
        <div className="mt-8 meow-yellow p-4 rounded-lg">
          <h4 className="font-bold text-meow-green mb-2">Special Offer!</h4>
          <p className="text-sm text-gray-700 mb-3">Get 5% off on your first order</p>
          <Button className="meow-green text-white px-4 py-2 rounded text-sm hover-meow-green w-full">
            Claim Now
          </Button>
        </div>
      </div>
    </aside>
  );
}
