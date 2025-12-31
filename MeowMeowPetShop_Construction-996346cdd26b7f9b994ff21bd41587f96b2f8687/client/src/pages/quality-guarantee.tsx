
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Award, Heart, ShieldCheck, Star, ThumbsUp, Leaf } from 'lucide-react';

export default function QualityGuaranteePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <div className="text-center mb-8">
            <Award className="w-16 h-16 text-[#26732d] mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Quality Guarantee</h1>
            <p className="text-gray-600">Your pet's health and happiness is our commitment</p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-[#26732d]" />
                Our Quality Promise
              </h2>
              <p className="text-gray-700 mb-4">
                At Meow Meow Pet Shop, we are committed to providing only the highest quality pet food and accessories. 
                Every product we sell meets strict quality standards and is sourced from trusted manufacturers.
              </p>
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                <p className="text-green-900 font-semibold text-lg text-center">
                  100% Authentic Products - Guaranteed Fresh - Premium Quality
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-6 h-6 text-[#26732d]" />
                What We Guarantee
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Leaf className="w-5 h-5" />
                    Freshness
                  </h3>
                  <p className="text-blue-800">
                    All food products are fresh with long expiration dates. We regularly rotate stock to ensure maximum freshness.
                  </p>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Authenticity
                  </h3>
                  <p className="text-purple-800">
                    We source products directly from authorized distributors and manufacturers. Every product is 100% genuine.
                  </p>
                </div>
                
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h3 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                    <ThumbsUp className="w-5 h-5" />
                    Safety
                  </h3>
                  <p className="text-orange-800">
                    All products meet international safety standards and are safe for your pets. We never compromise on safety.
                  </p>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Nutrition
                  </h3>
                  <p className="text-green-800">
                    Our pet food selection is nutritionally balanced and formulated by experts to support your pet's health.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Quality Control Process</h2>
              <p className="text-gray-700 mb-4">
                Every product goes through our rigorous quality control process:
              </p>
              <ol className="list-decimal list-inside text-gray-700 space-y-3 ml-4">
                <li className="font-semibold">
                  Supplier Verification
                  <p className="font-normal ml-6 mt-1">
                    We partner only with authorized and certified suppliers who meet our quality standards.
                  </p>
                </li>
                <li className="font-semibold">
                  Product Inspection
                  <p className="font-normal ml-6 mt-1">
                    Each batch is inspected for quality, packaging integrity, and expiration dates.
                  </p>
                </li>
                <li className="font-semibold">
                  Storage Standards
                  <p className="font-normal ml-6 mt-1">
                    Products are stored in climate-controlled conditions to maintain freshness and quality.
                  </p>
                </li>
                <li className="font-semibold">
                  Regular Monitoring
                  <p className="font-normal ml-6 mt-1">
                    We continuously monitor product quality and customer feedback to ensure satisfaction.
                  </p>
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment to You</h2>
              <p className="text-gray-700 mb-4">
                If you're not satisfied with any product, we will:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Replace the product with a fresh batch at no extra cost</li>
                <li>Provide a full refund if the product doesn't meet our quality standards</li>
                <li>Address any quality concerns within 24 hours</li>
                <li>Take immediate action to prevent similar issues in the future</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Trusted Brands</h2>
              <p className="text-gray-700 mb-4">
                We stock only premium brands known for their quality:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                  <p className="font-semibold text-gray-900">Reflex Plus</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                  <p className="font-semibold text-gray-900">Royal Canin</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                  <p className="font-semibold text-gray-900">Purina ONE</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                  <p className="font-semibold text-gray-900">Sheba</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                  <p className="font-semibold text-gray-900">Nekko</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                  <p className="font-semibold text-gray-900">And More...</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Over years of experience in the pet care industry</li>
                <li>Thousands of satisfied customers across Bangladesh</li>
                <li>Expert staff who understand pet nutrition and care</li>
                <li>Competitive prices without compromising on quality</li>
                <li>Responsive customer service team</li>
                <li>Easy returns and exchanges</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Have Questions?</h2>
              <p className="text-gray-700 mb-4">
                Our team is here to help with any quality-related concerns:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Phone:</strong> 01405-045023</p>
                <p className="text-gray-700"><strong>Email:</strong> meowmeowpetshop1@gmail.com</p>
                <p className="text-gray-700"><strong>Hours:</strong> Daily 9 AM - 9 PM</p>
                <p className="text-gray-700 mt-2"><strong>Visit us:</strong> Savar, Dhaka, Bangladesh</p>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
