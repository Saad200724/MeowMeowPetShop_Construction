
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Shield, Lock, Eye, UserCheck, Database, Mail } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <div className="text-center mb-8">
            <Shield className="w-16 h-16 text-[#26732d] mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
            <p className="text-gray-600">Last Updated: January 2025</p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <UserCheck className="w-6 h-6 text-[#26732d]" />
                Information We Collect
              </h2>
              <p className="text-gray-700 mb-4">
                At Meow Meow Pet Shop, we collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Name, email address, phone number, and delivery address</li>
                <li>Payment information (processed securely through our payment partners)</li>
                <li>Order history and purchase preferences</li>
                <li>Account credentials and profile information</li>
                <li>Communication preferences and customer service interactions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Database className="w-6 h-6 text-[#26732d]" />
                How We Use Your Information
              </h2>
              <p className="text-gray-700 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Process and fulfill your orders</li>
                <li>Send order confirmations and shipping updates</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Send promotional emails about new products and special offers (with your consent)</li>
                <li>Improve our website and shopping experience</li>
                <li>Prevent fraud and maintain security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="w-6 h-6 text-[#26732d]" />
                Data Security
              </h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate security measures to protect your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Secure SSL encryption for all transactions</li>
                <li>Payment information is processed through secure third-party payment gateways</li>
                <li>Regular security audits and updates</li>
                <li>Restricted access to personal data by authorized personnel only</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="w-6 h-6 text-[#26732d]" />
                Information Sharing
              </h2>
              <p className="text-gray-700 mb-4">
                We do not sell or rent your personal information to third parties. We may share your information with:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Delivery partners to fulfill your orders</li>
                <li>Payment processors to complete transactions</li>
                <li>Service providers who assist in operating our website</li>
                <li>Legal authorities when required by law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="w-6 h-6 text-[#26732d]" />
                Your Rights
              </h2>
              <p className="text-gray-700 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your personal data</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="mt-4 bg-gray-50 p-4 rounded-lg">
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
