import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Footer() {
  const quickLinks = [
    { name: "Shop", href: "#" },
    { name: "Categories", href: "#" },
    { name: "FAQ", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Terms & Conditions", href: "#" },
  ];

  const categories = [
    { name: "Cat Food", href: "#" },
    { name: "Dog Food", href: "#" },
    { name: "Pet Toys", href: "#" },
    { name: "Pet Accessories", href: "#" },
    { name: "Pet Care & Health", href: "#" },
  ];

  const socialLinks = [
    { icon: "fab fa-facebook", href: "#" },
    { icon: "fab fa-instagram", href: "#" },
    { icon: "fab fa-twitter", href: "#" },
    { icon: "fab fa-youtube", href: "#" },
  ];

  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="/logo.png"
                alt="Meow Meow Pet Shop Logo"
                className="h-10 w-auto"
              />
              <h4 className="text-xl font-bold">Meow Meow Pet Shop</h4>
            </div>
            <p className="text-gray-300 mb-4">
              Your trusted partner for premium pet care products in Bangladesh. Making pets happy since 2020.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-gray-300 hover:text-primary-yellow transition-colors"
                >
                  <i className={`${social.icon} text-lg`}></i>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h5 className="text-lg font-semibold mb-4">Quick Links</h5>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-primary-yellow transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-lg font-semibold mb-4">Categories</h5>
            <ul className="space-y-2">
              {categories.map((category, index) => (
                <li key={index}>
                  <a
                    href={category.href}
                    className="text-gray-300 hover:text-primary-yellow transition-colors"
                  >
                    {category.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-lg font-semibold mb-4">Contact Info</h5>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-yellow" />
                <span className="text-gray-300">01408076089</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-yellow" />
                <span className="text-gray-300">info@mewmewshopbd.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-primary-yellow" />
                <span className="text-gray-300">Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-primary-yellow" />
                <span className="text-gray-300">24/7 Online Service</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2025 Meow Meow Pet Shop. All rights reserved. | Made with ❤️ for pet lovers
          </p>
        </div>
      </div>
    </footer>
  );
}
