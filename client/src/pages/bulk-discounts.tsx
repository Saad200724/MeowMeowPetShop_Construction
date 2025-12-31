import { Home, Package, CheckCircle, Users, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function BulkDiscountsPage() {
  const discountTiers = [
    {
      quantity: "5-9 items",
      discount: "10%",
      description: "Perfect for small households with multiple pets",
      color: "bg-blue-50 border-blue-200",
      textColor: "text-blue-800",
      badgeColor: "bg-blue-100 text-blue-800"
    },
    {
      quantity: "10-19 items", 
      discount: "20%",
      description: "Great for pet shelters and rescue organizations",
      color: "bg-green-50 border-green-200",
      textColor: "text-green-800",
      badgeColor: "bg-green-100 text-green-800"
    },
    {
      quantity: "20-49 items",
      discount: "30%",
      description: "Ideal for large facilities and breeding programs",
      color: "bg-purple-50 border-purple-200", 
      textColor: "text-purple-800",
      badgeColor: "bg-purple-100 text-purple-800"
    },
    {
      quantity: "50+ items",
      discount: "40%",
      description: "Maximum savings for wholesale customers",
      color: "bg-orange-50 border-orange-200",
      textColor: "text-orange-800", 
      badgeColor: "bg-orange-100 text-orange-800"
    }
  ];

  const benefits = [
    {
      icon: <Package className="w-8 h-8 text-[#26732d]" />,
      title: "Fresh Quality Guaranteed",
      description: "All bulk orders are freshly packed and quality checked before shipping"
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-[#26732d]" />,
      title: "Extended Expiry Dates",
      description: "Bulk products come with longer shelf life to ensure freshness"
    },
    {
      icon: <Users className="w-8 h-8 text-[#26732d]" />,
      title: "Custom Packaging",
      description: "We can customize packaging sizes based on your specific needs"
    },
    {
      icon: <Heart className="w-8 h-8 text-[#26732d]" />,
      title: "Supporting Animal Welfare",
      description: "Special discounts for registered animal shelters and rescue organizations"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="relative">
            {/* Go Back Button */}
            <div className="absolute left-0 top-0">
              <a 
                href="/bulk-products" 
                className="inline-flex items-center gap-1 px-4 py-2 bg-[#26732d] text-white rounded-lg hover:bg-[#1e5d26] transition-colors"
              >
                <Package size={18} />
                Back to Bulk Products
              </a>
            </div>
            
            <div className="text-center">
              <h1 className="text-4xl font-bold text-[#26732d] mb-4 flex items-center justify-center gap-1">
                <Package size={40} className="text-[#26732d]" />
                Bulk Discount Program
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Save more when you buy more! Our bulk discount program offers substantial savings for pet stores, shelters, and multi-pet households.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Discount Tiers */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Discount Tiers</h2>
          <p className="text-lg text-gray-600">The more you buy, the more you save!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 mb-12">
          {discountTiers.map((tier, index) => (
            <div key={index} className={`${tier.color} rounded-lg p-6 border-2 text-center`}>
              <Badge className={`${tier.badgeColor} mb-4 text-lg font-bold px-4 py-2`}>
                {tier.discount} OFF
              </Badge>
              <h3 className={`text-xl font-bold ${tier.textColor} mb-2`}>
                {tier.quantity}
              </h3>
              <p className={`${tier.textColor} text-sm`}>
                {tier.description}
              </p>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why Choose Our Bulk Program?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-1">
                <div className="flex-shrink-0">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-r from-[#26732d] to-[#1e5d26] rounded-lg shadow-lg p-8 text-white mb-12">
          <h2 className="text-2xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Browse & Select</h3>
              <p className="text-green-100">Choose your favorite products from our bulk collection</p>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Add to Cart</h3>
              <p className="text-green-100">Add items to your cart - discounts apply automatically</p>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Save Big</h3>
              <p className="text-green-100">Enjoy instant savings at checkout</p>
            </div>
          </div>
        </div>

        {/* Special Programs */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Special Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <div className="text-center">
              <Heart className="w-12 h-12 text-[#26732d] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Animal Shelter Program</h3>
              <p className="text-gray-600 mb-4">
                Registered animal shelters and rescue organizations get an additional 10% discount on all bulk orders.
              </p>
              <Badge className="bg-[#26732d] text-white">Extra 10% OFF</Badge>
            </div>
            <div className="text-center">
              <Star className="w-12 h-12 text-[#26732d] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Loyalty Rewards</h3>
              <p className="text-gray-600 mb-4">
                Regular bulk customers earn loyalty points for even greater savings on future orders.
              </p>
              <Badge className="bg-[#26732d] text-white">Earn Points</Badge>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Saving?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Browse our bulk products and start enjoying instant discounts today!
          </p>
          <div className="flex flex-col sm:flex-row gap-1 justify-center">
            <a href="/bulk-products">
              <Button size="lg" className="bg-[#26732d] text-white hover:bg-[#1e5d26] w-full sm:w-auto">
                Shop Bulk Products
              </Button>
            </a>
            <a href="/contact">
              <Button size="lg" variant="outline" className="border-[#26732d] text-[#26732d] hover:bg-[#26732d] hover:text-white w-full sm:w-auto">
                Contact for Custom Orders
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}