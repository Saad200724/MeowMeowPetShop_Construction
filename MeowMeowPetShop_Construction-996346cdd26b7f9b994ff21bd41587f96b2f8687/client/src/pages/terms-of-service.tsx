
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { FileText, Scale, ShieldCheck, AlertTriangle, Users, CreditCard } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <div className="text-center mb-8">
            <FileText className="w-16 h-16 text-[#26732d] mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
            <p className="text-gray-600">Effective Date: January 2025</p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Scale className="w-6 h-6 text-[#26732d]" />
                Acceptance of Terms
              </h2>
              <p className="text-gray-700 mb-4">
                By accessing and using Meow Meow Pet Shop's website and services, you agree to be bound by these Terms of Service. 
                If you do not agree with any part of these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-[#26732d]" />
                User Accounts
              </h2>
              <p className="text-gray-700 mb-4">
                When you create an account with us, you agree to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information to keep it accurate</li>
                <li>Maintain the security of your password</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-[#26732d]" />
                Orders and Payments
              </h2>
              <p className="text-gray-700 mb-4">
                By placing an order through our website, you agree that:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>All orders are subject to acceptance and availability</li>
                <li>Prices are in Bangladeshi Taka (BDT) and may change without notice</li>
                <li>We reserve the right to refuse or cancel any order</li>
                <li>Payment must be made in full before order processing</li>
                <li>You are responsible for providing accurate delivery information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Information</h2>
              <p className="text-gray-700 mb-4">
                We strive to provide accurate product information, but:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Product images are for illustration purposes and may vary slightly</li>
                <li>Product descriptions are provided by manufacturers and are subject to change</li>
                <li>We do not warrant that product descriptions are accurate or complete</li>
                <li>Actual packaging and materials may vary from those shown</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-[#26732d]" />
                Prohibited Uses
              </h2>
              <p className="text-gray-700 mb-4">
                You may not use our website to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Violate any laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Transmit harmful or malicious code</li>
                <li>Engage in fraudulent activities</li>
                <li>Harass or harm other users</li>
                <li>Collect user information without consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                All content on this website, including text, graphics, logos, and images, is the property of Meow Meow Pet Shop 
                and is protected by copyright and trademark laws. You may not reproduce, distribute, or modify any content 
                without our written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-[#26732d]" />
                Limitation of Liability
              </h2>
              <p className="text-gray-700 mb-4">
                To the fullest extent permitted by law, Meow Meow Pet Shop shall not be liable for:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Indirect, incidental, or consequential damages</li>
                <li>Loss of profits, data, or business opportunities</li>
                <li>Damages arising from use of our products or services</li>
                <li>Third-party content or actions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Delivery and Shipping</h2>
              <p className="text-gray-700 mb-4">
                We make every effort to deliver products on time, but:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Delivery times are estimates and not guaranteed</li>
                <li>Delays may occur due to unforeseen circumstances</li>
                <li>We are not responsible for delays caused by courier services</li>
                <li>Incorrect addresses provided by customers may result in additional charges</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. 
                Your continued use of our services after changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
              <p className="text-gray-700 mb-4">
                These terms are governed by the laws of Bangladesh. Any disputes shall be resolved in the courts of Dhaka, Bangladesh.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-700 mb-4">
                For questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> meowmeowpetshop1@gmail.com</p>
                <p className="text-gray-700"><strong>Phone:</strong> 01405-045023</p>
                <p className="text-gray-700"><strong>Address:</strong> Savar, Dhaka, Bangladesh</p>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
