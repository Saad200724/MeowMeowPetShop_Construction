import { Facebook, Instagram, Youtube, MessageCircle, MapPin, Phone, Mail, Clock } from 'lucide-react';
import MobileFooter from './mobile-footer';
const logoPath = '/logo.png';

export default function Footer() {
  return (
    <>
      {/* Mobile Footer */}
      <MobileFooter />
      
      {/* Desktop Footer */}
      <footer className="hidden md:block meow-green text-white py-12 relative z-40 w-full">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <img src={logoPath} alt="Meow Meow Pet Shop Logo" className="h-12 w-12 mr-3" />
              <div>
                <h3 className="text-xl font-bold text-meow-yellow">Meow Meow</h3>
                <p className="text-sm">Pet Shop</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4">Your trusted partner for premium pet food and accessories in Savar, Bangladesh. We care for your pets like family.</p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/meow.meow.pet.shop1" target="_blank" rel="noopener noreferrer" className="text-meow-yellow hover:text-yellow-300 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-meow-yellow hover:text-yellow-300 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-meow-yellow hover:text-yellow-300 transition-colors">
                <Youtube size={20} />
              </a>
              <a href="https://wa.me/8801838511583" className="text-meow-yellow hover:text-yellow-300 transition-colors">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-meow-yellow mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-meow-yellow transition-colors">Home</a></li>
              <li><a href="#" className="text-gray-300 hover:text-meow-yellow transition-colors">Cat Food</a></li>
              <li><a href="#" className="text-gray-300 hover:text-meow-yellow transition-colors">Dog Food</a></li>
              <li><a href="#" className="text-gray-300 hover:text-meow-yellow transition-colors">Toys & Accessories</a></li>
              <li><a href="#" className="text-gray-300 hover:text-meow-yellow transition-colors">Grooming</a></li>
              <li><a href="#" className="text-gray-300 hover:text-meow-yellow transition-colors">Health Care</a></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-bold text-meow-yellow mb-4">Policies</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-meow-yellow transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-meow-yellow transition-colors">Return Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-meow-yellow transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-300 hover:text-meow-yellow transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-meow-yellow transition-colors">Quality Guarantee</a></li>
              <li><a href="#" className="text-gray-300 hover:text-meow-yellow transition-colors">Helpline</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-meow-yellow mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPin size={16} className="mr-3 text-meow-yellow" />
                <span className="text-gray-300">Savar, Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center">
                <Phone size={16} className="mr-3 text-meow-yellow" />
                <span className="text-gray-300">01405-045023</span>
              </div>
              <div className="flex items-center">
                <Mail size={16} className="mr-3 text-meow-yellow" />
                <span className="text-gray-300">meowmeowpetshop1gmail.com</span>
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-3 text-meow-yellow" />
                <span className="text-gray-300">Daily: 9 AM - 9 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 pt-8">
          <div className="text-center text-gray-400 text-sm pt-4">
            <p>&copy; 2025 Meow Meow Pet Shop. All rights reserved.</p>
            <p className="mt-1">Powered By: <a href="https://znforge.com" target="_blank" rel="noopener noreferrer" className="text-meow-yellow hover:text-yellow-300 transition-colors">ZnForge (znforge.com)</a></p>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
}