
import { Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'wouter';

const logoPath = '/logo.png';

export default function MobileFooter() {
  return (
    <footer className="md:hidden bg-gray-50 py-6 border-t border-gray-200 mt-8">
      <div className="container mx-auto px-4">
        {/* Logo and Company Info */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center mb-2">
            <img src={logoPath} alt="Meow Meow Pet Shop Logo" className="h-8 w-8 mr-2" />
            <div>
              <h3 className="text-sm font-bold text-[#26732d]">Meow Meow</h3>
              <p className="text-xs text-gray-600">Pet Shop</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Cat Accessories & Food in Bangladesh. Get the Best Pet Food &
            Cat Accessories in Bangladesh. Buy Cat Food, Cat Litter, Dog Food & Accessories.
          </p>
        </div>

        {/* Contact Info */}
        <div className="mb-4">
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center text-xs text-gray-600">
              <MapPin size={12} className="mr-1 text-[#26732d]" />
              <span>House #49/5-1, Road# 11, Bihail Aman Housing Society, Adabor, 1207 Dhaka, Bangladesh</span>
            </div>
            <div className="flex items-center justify-center text-xs text-gray-600">
              <Phone size={12} className="mr-1 text-[#26732d]" />
              <span>01405-045023</span>
            </div>
            <div className="flex items-center justify-center text-xs text-gray-600">
              <Mail size={12} className="mr-1 text-[#26732d]" />
              <span>meowmeowpetshop1@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-3 gap-4 mb-4 text-xs">
          {/* Get to Know Us */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">GET TO KNOW US</h4>
            <ul className="space-y-1">
              <li><Link href="/blog" className="text-gray-600 hover:text-[#26732d]">Blogs</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-[#26732d]">Contact Us</Link></li>
              <li><Link href="/about" className="text-gray-600 hover:text-[#26732d]">About Us</Link></li>
              <li><Link href="/brands" className="text-gray-600 hover:text-[#26732d]">Our Brands</Link></li>
              <li><Link href="/privilege-club" className="text-gray-600 hover:text-[#26732d]">Mew Mew Loyalty Hub</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">POLICIES</h4>
            <ul className="space-y-1">
              <li><Link href="/privacy" className="text-gray-600 hover:text-[#26732d]">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-600 hover:text-[#26732d]">Terms & Condition</Link></li>
              <li><Link href="/return-policy" className="text-gray-600 hover:text-[#26732d]">Refund & Return Policy</Link></li>
              <li><Link href="/reward-points" className="text-gray-600 hover:text-[#26732d]">Reward Points Policy</Link></li>
            </ul>
          </div>

          {/* Advantage */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">ADVANTAGE</h4>
            <ul className="space-y-1">
              <li><Link href="/track-order" className="text-gray-600 hover:text-[#26732d]">Track My Order</Link></li>
            </ul>
            <h4 className="font-semibold text-gray-800 mt-3 mb-2">LET'S HELP YOU</h4>
            <ul className="space-y-1">
              <li><Link href="/faq" className="text-gray-600 hover:text-[#26732d]">FAQ</Link></li>
              <li><Link href="/brands" className="text-gray-600 hover:text-[#26732d]">All Brands</Link></li>
              <li><Link href="/privilege-club" className="text-gray-600 hover:text-[#26732d]">Privilege Club</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center border-t border-gray-200 pt-3">
          <p className="text-xs text-gray-500">
            © 2025 Meow Meow Shop BD - All rights reserved
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Powered by DevCart
          </p>
        </div>
      </div>
    </footer>
  );
}
