
import { useEffect } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Truck, MapPin, Clock, DollarSign, Package2, CheckCircle } from 'lucide-react';

export default function ShippingPolicyPage() {
  useEffect(() => {
    document.title = 'Shipping Policy - Meow Meow Pet Shop';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Meow Meow Pet Shop shipping policy. Delivery across Bangladesh - Inside Dhaka ৳80, Outside Dhaka ৳130. Fast and reliable delivery.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Meow Meow Pet Shop shipping policy. Delivery across Bangladesh - Inside Dhaka ৳80, Outside Dhaka ৳130. Fast and reliable delivery.';
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <div className="text-center mb-8">
            <Truck className="w-16 h-16 text-[#26732d] mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Shipping Policy</h1>
            <p className="text-gray-600">Fast and reliable delivery across Bangladesh</p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-[#26732d]" />
                Delivery Areas
              </h2>
              <p className="text-gray-700 mb-4">
                We currently deliver to the following areas:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Inside Dhaka
                  </h3>
                  <ul className="list-disc list-inside text-green-800 space-y-1 ml-4">
                    <li>Savar and surrounding areas</li>
                    <li>Mirpur, Mohammadpur, Dhanmondi</li>
                    <li>Uttara, Gulshan, Banani</li>
                    <li>All major areas of Dhaka city</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Outside Dhaka
                  </h3>
                  <ul className="list-disc list-inside text-blue-800 space-y-1 ml-4">
                    <li>Major cities (Chittagong, Sylhet, Rajshahi)</li>
                    <li>District headquarters</li>
                    <li>Available through courier services</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-[#26732d]" />
                Delivery Timeframes
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Inside Dhaka (Savar Area)</h3>
                  <p className="text-gray-700">1-2 business days</p>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Inside Dhaka (Other Areas)</h3>
                  <p className="text-gray-700">2-3 business days</p>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Outside Dhaka</h3>
                  <p className="text-gray-700">3-5 business days</p>
                </div>
              </div>
              <p className="text-gray-600 mt-4 text-sm">
                *Delivery times are estimates and may vary due to unforeseen circumstances, weather conditions, or courier delays.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-[#26732d]" />
                Shipping Charges
              </h2>
              <div className="space-y-4">
                <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-5">
                  <h3 className="font-bold text-blue-900 mb-3 text-lg">Standard Shipping Rates</h3>
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                        Inside Dhaka City
                      </h4>
                      <p className="text-blue-800 font-medium text-lg">৳80 (up to 2kg)</p>
                      <p className="text-sm text-blue-700 mt-1">Perfect for most orders within Dhaka city</p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                        Outside Dhaka & Sub-Urban
                      </h4>
                      <p className="text-blue-800 font-medium text-lg">৳130 (up to 1kg)</p>
                      <p className="text-sm text-blue-700 mt-1">Includes Dhaka Sub-Urban areas and all other districts</p>
                    </div>
                    
                    <div className="bg-orange-50 border border-orange-300 rounded-lg p-4 mt-3">
                      <h4 className="font-semibold text-orange-900 mb-2">Additional Weight Charges</h4>
                      <p className="text-orange-800 font-medium">৳20 per kg for extra weight</p>
                      <p className="text-sm text-orange-700 mt-1">
                        Applied when package exceeds base weight limit
                      </p>
                    </div>
                  </div>
                </div>
                
                

                <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Shipping Examples:</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-[#26732d] font-bold">•</span>
                      <span><strong>Package to Dhaka City:</strong> ৳80 (up to 2kg)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#26732d] font-bold">•</span>
                      <span><strong>Package to Dhaka Sub-Urban/Outside:</strong> ৳130 (up to 1kg)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#26732d] font-bold">•</span>
                      <span><strong>Additional Weight:</strong> ৳20 per kg extra</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package2 className="w-6 h-6 text-[#26732d]" />
                Order Processing
              </h2>
              <p className="text-gray-700 mb-4">
                Our order processing workflow:
              </p>
              <ol className="list-decimal list-inside text-gray-700 space-y-3 ml-4">
                <li className="font-semibold">
                  Order Confirmation
                  <p className="font-normal ml-6 mt-1">
                    You will receive an email confirmation immediately after placing your order.
                  </p>
                </li>
                <li className="font-semibold">
                  Order Processing
                  <p className="font-normal ml-6 mt-1">
                    Orders are typically processed within 24 hours during business days.
                  </p>
                </li>
                <li className="font-semibold">
                  Dispatch Notification
                  <p className="font-normal ml-6 mt-1">
                    You will receive a notification when your order is dispatched with tracking information.
                  </p>
                </li>
                <li className="font-semibold">
                  Delivery
                  <p className="font-normal ml-6 mt-1">
                    Our delivery partner will contact you before delivery to confirm the address.
                  </p>
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Tracking</h2>
              <p className="text-gray-700 mb-4">
                You can track your order in the following ways:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Check your email for tracking updates</li>
                <li>Log into your account and view order status</li>
                <li>Use the tracking number provided with courier services</li>
                <li>Contact our customer service at 01405-045023</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Special Instructions</h2>
              <p className="text-gray-700 mb-4">
                Please note:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Someone must be available to receive the delivery</li>
                <li>We may require ID verification for high-value orders</li>
                <li>Perishable items are packed with care to maintain freshness</li>
                <li>Fragile items are handled with extra care during shipping</li>
                <li>Contact us immediately if you receive damaged items</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 mb-4">
                For shipping-related queries:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Phone:</strong> 01405-045023</p>
                <p className="text-gray-700"><strong>Email:</strong> meowmeowpetshop1@gmail.com</p>
                <p className="text-gray-700"><strong>Hours:</strong> Daily 9 AM - 9 PM</p>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
