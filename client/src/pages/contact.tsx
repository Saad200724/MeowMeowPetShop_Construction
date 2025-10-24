import { useState } from 'react';
import { MapPin, Phone, Clock, Facebook, Instagram, MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import emailjs from '@emailjs/browser';

export default function ContactPage() {
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

      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get in touch with our friendly team
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 max-w-7xl mx-auto">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>

            {/* Store Address */}
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <MapPin className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Store Address</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Pakiza Bus Stand, Chapra Mosjid Road<br />
                      Bank Colony, Savar, Dhaka
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Phone */}
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Phone className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
                    <p className="text-gray-600 text-sm">+880 1405-045023</p>
                    <p className="text-gray-500 text-xs mt-1">Call us for orders and inquiries</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Facebook Messenger */}
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <MessageCircle className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Facebook Messenger</h3>
                    <p className="text-gray-600 text-sm mb-3">Meow.meow.pet.shop</p>
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md"
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
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Clock className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Opening Hours</h3>
                    <div className="text-gray-600 text-sm space-y-1">
                      <p>Every Day: 10:00 AM - 10:00 PM</p>
                      <p className="text-gray-500 text-xs">We're always here for your pets!</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Follow Us */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Follow Us</h3>
              <div className="flex space-x-3">
                <a
                  href="https://facebook.com/meow.meow.pet.shop1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white hover:bg-pink-700 transition-colors"
                >
                  <Instagram size={20} />
                </a>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('toggleChat'))}
                  className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white hover:bg-green-700 transition-colors"
                >
                  <MessageCircle size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full"
                        placeholder="Enter your full name"
                        required
                        data-testid="input-contact-name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full"
                        placeholder="01700-000000"
                        required
                        data-testid="input-contact-phone"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email (Optional)
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full"
                      placeholder="your.email@example.com"
                      data-testid="input-contact-email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <Select onValueChange={(value) => handleInputChange('subject', value)} required>
                      <SelectTrigger className="w-full" data-testid="select-contact-subject">
                        <SelectValue placeholder="Select a subject" />
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className="w-full h-32 resize-none"
                      placeholder="Tell us how we can help you..."
                      required
                      data-testid="textarea-contact-message"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#26732d] hover:bg-[#1e5d26] text-white py-3 text-lg font-medium"
                    data-testid="button-send-message"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Find Our Store</h2>
          <Card className="border-0 shadow-md overflow-hidden">
            <div className="h-96 bg-gray-200 relative">
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
                className="absolute top-4 right-4 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-lg z-10"
                size="sm"
                onClick={() => window.open('https://www.google.com/maps/dir//Meow+Meow+Pet+shop,+Pakiza+Bus+Stand,+Chapra+Mosjid+Road,+Bank+Colony,+Savar,+Dhaka,+Bangladesh/@23.842804,90.254905,17z', '_blank')}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Directions
              </Button>
            </div>
          </Card>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-10 h-10 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">Visit Our Store</h3>
                <p className="text-gray-600 text-sm">Bank Colony, Savar</p>
                <p className="text-gray-500 text-xs">Pakiza Bus Stand</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-10 h-10 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">Call Us</h3>
                <p className="text-gray-600 text-sm">+880 1405-045023</p>
                <p className="text-gray-500 text-xs">Daily 10 AM - 10 PM</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">Message Us</h3>
                <p className="text-gray-600 text-sm">Facebook Messenger</p>
                <p className="text-gray-500 text-xs">Quick Response</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}