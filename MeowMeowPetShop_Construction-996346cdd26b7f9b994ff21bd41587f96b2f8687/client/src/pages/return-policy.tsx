
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { RotateCcw, Package, Clock, AlertCircle, CheckCircle, Phone } from 'lucide-react';

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <div className="text-center mb-8">
            <RotateCcw className="w-16 h-16 text-[#26732d] mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Return Policy</h1>
            <p className="text-gray-600">Your satisfaction is our priority</p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-[#26732d]" />
                Return Window
              </h2>
              <p className="text-gray-700 mb-4">
                We accept returns within <strong>7 days</strong> of delivery for most products. The product must be:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Unused and in original condition</li>
                <li>In original packaging with all labels intact</li>
                <li>Accompanied by the original invoice</li>
                <li>Not expired or near expiration (for food items)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-6 h-6 text-[#26732d]" />
                Eligible Items
              </h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Returnable Items
                </h3>
                <ul className="list-disc list-inside text-green-800 space-y-1 ml-4">
                  <li>Unopened pet food packages</li>
                  <li>Unused toys and accessories</li>
                  <li>Defective or damaged products</li>
                  <li>Wrong items delivered</li>
                </ul>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Non-Returnable Items
                </h3>
                <ul className="list-disc list-inside text-red-800 space-y-1 ml-4">
                  <li>Opened food packages or treats</li>
                  <li>Used or washed clothing items</li>
                  <li>Personalized or custom products</li>
                  <li>Products on clearance or final sale</li>
                  <li>Perishable items past their return window</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Return Process</h2>
              <ol className="list-decimal list-inside text-gray-700 space-y-3 ml-4">
                <li className="font-semibold">
                  Contact Us
                  <p className="font-normal ml-6 mt-1">
                    Call us at 01405-045023 or email meowmeowpetshop1@gmail.com within 7 days of receiving your order.
                  </p>
                </li>
                <li className="font-semibold">
                  Get Return Authorization
                  <p className="font-normal ml-6 mt-1">
                    Our team will review your request and provide a return authorization number if eligible.
                  </p>
                </li>
                <li className="font-semibold">
                  Pack the Item
                  <p className="font-normal ml-6 mt-1">
                    Securely pack the item in its original packaging with the invoice and return authorization number.
                  </p>
                </li>
                <li className="font-semibold">
                  Ship or Drop Off
                  <p className="font-normal ml-6 mt-1">
                    Ship the item back to us or drop it off at our Savar location.
                  </p>
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Process</h2>
              <p className="text-gray-700 mb-4">
                Once we receive and inspect your return:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Refunds are processed within 5-7 business days</li>
                <li>Refunds are issued to the original payment method</li>
                <li>Shipping charges are non-refundable (except for defective items)</li>
                <li>You will receive an email confirmation once the refund is processed</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Exchanges</h2>
              <p className="text-gray-700 mb-4">
                We are happy to exchange products for:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Different sizes or flavors of the same product</li>
                <li>Defective items with a working replacement</li>
                <li>Wrong items delivered</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Phone className="w-6 h-6 text-[#26732d]" />
                Need Help?
              </h2>
              <p className="text-gray-700 mb-4">
                Our customer service team is here to help with any return questions:
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
