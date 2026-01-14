
import { Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'wouter';

const logoPath = '/logo.png';

export default function MobileFooter() {
  return (
    <footer className="md:hidden meow-green text-white py-4 mt-8 pb-4">
      <div className="container mx-auto px-4">
        {/* Logo and Company Info */}
        <div className="text-left mb-3">
          <div className="flex items-center mb-2">
            <img src={logoPath} alt="Meow Meow Pet Shop Logo" className="h-8 w-8 mr-2" />
            <div>
              <h3 className="text-sm font-bold text-meow-yellow">Meow Meow</h3>
              <p className="text-xs text-gray-300">Pet Shop</p>
            </div>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            Your trusted partner for premium pet food and accessories in Savar, Bangladesh.
          </p>
        </div>

        {/* Contact Info - Compact */}
        <div className="text-left space-y-1 mb-3">
          <div className="flex items-center text-xs text-gray-300">
            <Phone size={12} className="mr-1 text-meow-yellow" />
            <span>01405-045023</span>
          </div>
          <div className="flex items-center text-xs text-gray-300">
            <Mail size={12} className="mr-1 text-meow-yellow" />
            <span>meowmeowpetshop1@gmail.com</span>
          </div>
        </div>

        {/* Essential Links - 2 columns */}
        <div className="grid grid-cols-2 gap-4 mb-3 text-xs">
          <div>
            <h4 className="font-semibold text-meow-yellow mb-2">Quick Links</h4>
            <ul className="space-y-1">
              <li><Link href="/contact" className="text-gray-300 hover:text-meow-yellow">Contact Us</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-meow-yellow">About Us</Link></li>
              <li><Link href="/track-order" className="text-gray-300 hover:text-meow-yellow">Track Order</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-meow-yellow mb-2">Policies</h4>
            <ul className="space-y-1">
              <li><Link href="/privacy-policy" className="text-gray-300 hover:text-meow-yellow">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-gray-300 hover:text-meow-yellow">Terms & Conditions</Link></li>
              <li><Link href="/return-policy" className="text-gray-300 hover:text-meow-yellow">Return Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center border-t border-gray-600 pt-2">
          <p className="text-xs text-gray-400">
            © 2026 Meow Meow Pet Shop. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 mt-1 mb-8">
            Powered By: <a href="https://znforge.dev" target="_blank" rel="noopener noreferrer" className="text-meow-yellow hover:text-yellow-300 transition-colors">ZnForge</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
