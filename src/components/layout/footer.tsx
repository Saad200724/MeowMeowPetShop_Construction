import { Facebook, Instagram, Youtube, MessageCircle, MapPin, Phone, Mail, Clock } from 'lucide-react';
const logoPath = '/logo.png';

export default function Footer() {
  return (
    <footer className="meow-green text-white py-12">
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
              <a href="#" className="text-meow-yellow hover:text-yellow-300 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-meow-yellow hover:text-yellow-300 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-meow-yellow hover:text-yellow-300 transition-colors">
                <Youtube size={20} />
              </a>
              <a href="#" className="text-meow-yellow hover:text-yellow-300 transition-colors">
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
                <span className="text-gray-300">+880-1234-567890</span>
              </div>
              <div className="flex items-center">
                <Mail size={16} className="mr-3 text-meow-yellow" />
                <span className="text-gray-300">info@meowmeowpetshop.com</span>
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-3 text-meow-yellow" />
                <span className="text-gray-300">Daily: 9 AM - 9 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges & Payment Methods */}
        <div className="border-t border-gray-600 mt-8 pt-8">
          <div className="grid md:grid-cols-2 gap-8 mb-6">
            <div className="text-center md:text-left">
              <h4 className="font-bold text-meow-yellow mb-4">Trust & Security</h4>
              <div className="flex justify-center md:justify-start space-x-4 flex-wrap mb-4">
                <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm font-medium">🔒 100% Secure</div>
                <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium">🛡️ SSL Protected</div>
                <div className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg text-sm font-medium">⭐ Trusted by 10K+</div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <h4 className="font-bold text-meow-yellow mb-4">We Accept</h4>
              <div className="flex justify-center md:justify-end space-x-3 flex-wrap">
                <div className="bg-white text-black px-3 py-1 rounded text-sm font-medium">bKash</div>
                <div className="bg-white text-black px-3 py-1 rounded text-sm font-medium">Nagad</div>
                <div className="bg-white text-black px-3 py-1 rounded text-sm font-medium">Rocket</div>
                <div className="bg-white text-black px-3 py-1 rounded text-sm font-medium">VISA</div>
                <div className="bg-white text-black px-3 py-1 rounded text-sm font-medium">MasterCard</div>
                <div className="bg-white text-black px-3 py-1 rounded text-sm font-medium">Cash on Delivery</div>
              </div>
            </div>
          </div>
          <div className="text-center text-gray-400 text-sm border-t border-gray-600 pt-4">
            <div className="flex items-center justify-center gap-4 mb-2">
              <div className="flex items-center gap-2">
              <span className="text-white font-medium text-xs">Follow:</span>
            </div>
              <p>&copy; 2024 Meow Meow Pet Shop. All rights reserved.</p>
              <img src={logoPath} alt="Meow Meow" className="h-8 w-8" />
            </div>
            <p>Developed with ❤️ for pet lovers in Bangladesh</p>
          </div>
        </div>
      </div>
    </footer>
  );
}