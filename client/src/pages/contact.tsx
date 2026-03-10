import { useEffect } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Clock, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { setSEO, seoMetadata } from '@/lib/seo';

export default function ContactPage() {
  useEffect(() => {
    setSEO({
      ...seoMetadata.contact,
      canonical: 'https://meowshopbd.me/contact',
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12 px-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4">Contact Us</h1>
        </div>

        <div className="lg:hidden space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Store Address */}
            <Card className="border-0 shadow-md hover-elevate transition-shadow">
              <CardContent className="p-3">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg mb-2 overflow-visible">
                    <MapPin className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-xs">Store Address</h3>
                  <p className="text-gray-600 text-[10px] leading-relaxed">
                    Pakiza Bus Stand, Chapra Mosjid Road<br />
                    Bank Colony, Savar, Dhaka
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Phone */}
            <Card className="border-0 shadow-md hover-elevate transition-shadow">
              <CardContent className="p-3">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg mb-2 overflow-visible">
                    <Phone className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-xs">Phone</h3>
                  <a href="tel:+8801405045023" className="text-gray-600 text-[10px] hover:text-emerald-600 transition-colors">
                    +880 1405-045023
                  </a>
                  <p className="text-gray-500 text-[9px] mt-0.5">Call us for orders and inquiries</p>
                </div>
              </CardContent>
            </Card>

            {/* Facebook Messenger */}
            <Card className="border-0 shadow-md hover-elevate transition-shadow">
              <CardContent className="p-3">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg mb-2 overflow-visible">
                    <MessageCircle className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-xs">Facebook Messenger</h3>
                  <p className="text-gray-600 text-[10px] mb-2">Meow.meow.pet.shop</p>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md text-[10px] py-2 h-auto min-h-[36px]"
                    onClick={() => window.open('https://facebook.com/meow.meow.pet.shop1', '_blank')}
                  >
                    <MessageCircle className="w-3 h-3 mr-1" />
                    Message Us
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Opening Hours */}
            <Card className="border-0 shadow-md hover-elevate transition-shadow">
              <CardContent className="p-3">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg mb-2 overflow-visible">
                    <Clock className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-xs">Opening Hours</h3>
                  <div className="text-gray-600 text-[10px] space-y-0.5">
                    <p>Every Day: 10:00 AM - 10:00 PM</p>
                    <p className="text-gray-500 text-[9px] mt-0.5">We're always here for your pets!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Follow Us */}
          <div className="mt-4 px-1">
            <h3 className="font-semibold text-gray-900 mb-2.5 text-sm">Follow Us</h3>
            <div className="flex space-x-2.5 justify-center">
              <a
                href="https://facebook.com/meow.meow.pet.shop1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors active:scale-95"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/meow_meow_pet_shop"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 bg-pink-600 rounded-full flex items-center justify-center text-white hover:bg-pink-700 transition-colors active:scale-95"
              >
                <Instagram size={20} />
              </a>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('toggleChat'))}
                className="w-11 h-11 bg-green-600 rounded-full flex items-center justify-center text-white hover:bg-green-700 transition-colors active:scale-95"
              >
                <MessageCircle size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-1 gap-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 gap-6">
            {/* Store Address */}
            <Card className="border-0 shadow-lg hover-elevate transition-all duration-300 bg-white">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <MapPin className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Store Address</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Pakiza Bus Stand, Chapra Mosjid Road<br />
                      Bank Colony, Savar, Dhaka
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Phone */}
            <Card className="border-0 shadow-lg hover-elevate transition-all duration-300 bg-white">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <Phone className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Phone</h3>
                    <a href="tel:+8801405045023" className="text-gray-600 text-sm hover:text-emerald-600 transition-colors font-medium">
                      +880 1405-045023
                    </a>
                    <p className="text-gray-500 text-xs mt-1">Call us for orders and inquiries</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Facebook Messenger */}
            <Card className="border-0 shadow-lg hover-elevate transition-all duration-300 bg-white">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <MessageCircle className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">Messenger</h3>
                    <p className="text-gray-600 text-sm mb-3">Meow.meow.pet.shop</p>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm text-sm"
                      onClick={() => window.open('https://facebook.com/meow.meow.pet.shop1', '_blank')}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message Us
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Opening Hours */}
            <Card className="border-0 shadow-lg hover-elevate transition-all duration-300 bg-white">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <Clock className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Opening Hours</h3>
                    <div className="text-gray-600 text-sm space-y-1">
                      <p className="font-medium">Every Day: 10:00 AM - 10:00 PM</p>
                      <p className="text-gray-500 text-xs">Always here for your pets!</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-6 sm:mt-8 lg:mt-12">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 text-center mb-4 sm:mb-6 lg:mb-8 px-2">Find Our Store</h2>
          <Card className="border-0 shadow-md overflow-hidden">
            <div className="h-56 sm:h-64 lg:h-96 bg-gray-200 relative">
              {/* Embedded Google Map */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d912.3297468964263!2d90.25490467115716!3d23.842804035630493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755eb2ecda85ab9%3A0x1aada17efba5882e!2sMeow%20Meow%20Pet%20shop!5e0!3m2!1sen!2sbd!4v1756620179156!5m2!1sen!2sbd"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Meow Meow Pet Shop Location - Pakiza Bus Stand, Savar, Dhaka"
              />

              {/* Directions Button */}
              <Button
                className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-lg z-10 text-xs sm:text-sm h-9 sm:h-auto min-h-[44px] sm:min-h-0 px-3 sm:px-4 touch-manipulation active:scale-95"
                onClick={() => window.open('https://www.google.com/maps/dir//Meow+Meow+Pet+shop,+Pakiza+Bus+Stand,+Chapra+Mosjid+Road,+Bank+Colony,+Savar,+Dhaka,+Bangladesh/@23.842804,90.254905,17z', '_blank')}
              >
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Directions
              </Button>
            </div>
          </Card>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-3 gap-3 lg:gap-6 mt-4 sm:mt-6 lg:mt-8">
            <Card 
              className="border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group active:scale-[0.98]"
              onClick={() => window.open('https://www.google.com/maps/dir//Meow+Meow+Pet+shop,+Pakiza+Bus+Stand,+Chapra+Mosjid+Road,+Bank+Colony,+Savar,+Dhaka,+Bangladesh/@23.842804,90.254905,17z', '_blank')}
            >
              <CardContent className="p-3 lg:p-6 text-center">
                <div className="w-12 h-12 lg:w-20 lg:h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-2 lg:mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-6 h-6 lg:w-10 lg:h-10 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1 lg:mb-2 text-xs lg:text-lg">Visit Our Store</h3>
                <p className="text-gray-600 text-[10px] lg:text-sm">Bank Colony, Savar</p>
                <p className="text-gray-500 text-[9px] lg:text-xs">Pakiza Bus Stand</p>
              </CardContent>
            </Card>

            <Card 
              className="border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group active:scale-[0.98]"
              onClick={() => window.location.href = 'tel:+8801405045023'}
            >
              <CardContent className="p-3 lg:p-6 text-center">
                <div className="w-12 h-12 lg:w-20 lg:h-20 bg-gradient-to-br from-emerald-400 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-2 lg:mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-6 h-6 lg:w-10 lg:h-10 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1 lg:mb-2 text-xs lg:text-lg">Call Us</h3>
                <p className="text-gray-600 text-[10px] lg:text-sm">
                  +880 1405-045023
                </p>
                <p className="text-gray-500 text-[9px] lg:text-xs">Daily 10 AM - 10 PM</p>
              </CardContent>
            </Card>

            <Card 
              className="border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group active:scale-[0.98]"
              onClick={() => window.open('https://m.me/meow.meow.pet.shop1', '_blank')}
            >
              <CardContent className="p-3 lg:p-6 text-center">
                <div className="w-12 h-12 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-2 lg:mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="w-6 h-6 lg:w-10 lg:h-10 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1 lg:mb-2 text-xs lg:text-lg">Message Us</h3>
                <p className="text-gray-600 text-[10px] lg:text-sm">Facebook Messenger</p>
                <p className="text-gray-500 text-[9px] lg:text-xs">Quick Response</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}