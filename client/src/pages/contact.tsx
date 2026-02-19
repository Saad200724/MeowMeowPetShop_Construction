import { useState, useEffect } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, MessageCircle, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import emailjs from '@emailjs/browser';
import { setSEO, seoMetadata } from '@/lib/seo';

export default function ContactPage() {
  useEffect(() => {
    setSEO({
      ...seoMetadata.contact,
      canonical: 'https://meowshopbd.me/contact',
    });
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Initialize EmailJS (you can also do this once in your app initialization)
      emailjs.init("public-4_2EJeuoHymsGSC0t"); // Your public key

      const templateParams = {
        from_name: formData.name,
        from_phone: formData.phone,
        from_email: formData.email || 'Not provided',
        subject: formData.subject,
        message: formData.message,
        to_name: 'Meow Meow Pet Shop',
        time: new Date().toLocaleString('en-US', { 
          timeZone: 'Asia/Dhaka',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) + ' (Bangladesh Time)',
      };

      await emailjs.send(
        'service_lygzcpc', // Your service ID
        'template_j90cwmp', // Your template ID
        templateParams
      );

      toast({
        title: "Message Sent Successfully!",
        description: "We'll get back to you within 24 hours.",
      });

      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('EmailJS error:', error);
      toast({
        title: "Failed to Send Message",
        description: "Please try again later or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
        <div className="hidden lg:grid lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
          {/* Contact Information Cards - Left Side */}
          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>

            <div className="grid grid-cols-1 gap-4">
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

          {/* Contact Form - Right Side */}
          <div className="lg:col-span-8">
            <Card className="border-0 shadow-xl overflow-hidden bg-white h-full">
              <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#26732d]/10 rounded-xl flex items-center justify-center">
                    <Send className="w-5 h-5 text-[#26732d]" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">Get in touch</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="h-12 border-gray-200 focus:border-[#26732d] focus:ring-[#26732d]/20"
                        placeholder="John Doe"
                        required
                        data-testid="input-contact-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="h-12 border-gray-200 focus:border-[#26732d] focus:ring-[#26732d]/20"
                        placeholder="017XX-XXXXXX"
                        required
                        data-testid="input-contact-phone"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Email Address (Optional)
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="h-12 border-gray-200 focus:border-[#26732d] focus:ring-[#26732d]/20"
                      placeholder="john@example.com"
                      data-testid="input-contact-email"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <Select onValueChange={(value) => handleInputChange('subject', value)} required>
                      <SelectTrigger className="h-12 border-gray-200 focus:border-[#26732d] focus:ring-[#26732d]/20" data-testid="select-contact-subject">
                        <SelectValue placeholder="What are you inquiring about?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="order">Order Support</SelectItem>
                        <SelectItem value="product">Product Question</SelectItem>
                        <SelectItem value="complaint">Complaint</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="wholesale">Wholesale Inquiry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className="min-h-[160px] border-gray-200 focus:border-[#26732d] focus:ring-[#26732d]/20 resize-none"
                      placeholder="How can we help you today?"
                      required
                      data-testid="textarea-contact-message"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-[#26732d] hover:bg-[#1e5d26] text-white text-lg font-bold shadow-lg shadow-[#26732d]/20 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
                    data-testid="button-send-message"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Send className="w-5 h-5" />
                        <span>Send</span>
                      </div>
                    )}
                  </Button>
                </form>
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