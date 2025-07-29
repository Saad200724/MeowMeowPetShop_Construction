import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Star, Gift, Heart } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/footer';

const membershipTiers = [
  {
    name: 'Silver Paw',
    price: '৳299',
    period: '/month',
    color: 'from-gray-400 to-gray-600',
    icon: Heart,
    benefits: [
      '5% discount on all products',
      'Free delivery on orders over ৳1,500',
      'Monthly pet care tips newsletter',
      'Birthday treats for your pet',
      'Priority customer support'
    ]
  },
  {
    name: 'Golden Paw',
    price: '৳599',
    period: '/month',
    color: 'from-yellow-400 to-yellow-600',
    icon: Star,
    popular: true,
    benefits: [
      '10% discount on all products',
      'Free delivery on all orders',
      'Monthly premium pet box',
      'Exclusive access to new products',
      'Free monthly vet consultation',
      'Pet grooming discounts',
      '24/7 pet care helpline'
    ]
  },
  {
    name: 'Diamond Paw',
    price: '৳999',
    period: '/month',
    color: 'from-blue-400 to-purple-600',
    icon: Crown,
    benefits: [
      '15% discount on all products',
      'Free same-day delivery',
      'Premium monthly pet box',
      'Personal pet advisor',
      'Free quarterly health checkup',
      'VIP grooming services',
      'Exclusive member events',
      'Emergency pet care support',
      'Custom meal planning'
    ]
  }
];

export default function PrivilegeClubPage() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Gift className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Join Our <span className="text-green-600">Privilege Club</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Give your furry friends the royal treatment they deserve. Exclusive benefits, 
            premium services, and endless love for your beloved pets.
          </p>
          <Badge variant="secondary" className="text-lg px-6 py-2">
            Over 10,000+ Happy Pet Parents
          </Badge>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {membershipTiers.map((tier) => {
              const IconComponent = tier.icon;
              return (
                <Card 
                  key={tier.name}
                  className={`relative transition-all duration-300 hover:scale-105 ${
                    tier.popular ? 'ring-2 ring-green-500 shadow-xl' : 'hover:shadow-lg'
                  } ${selectedTier === tier.name ? 'ring-2 ring-blue-500' : ''}`}
                  data-testid={`card-membership-${tier.name.toLowerCase().replace(' ', '-')}`}
                >
                  {tier.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600">
                      Most Popular
                    </Badge>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${tier.color} flex items-center justify-center mb-4`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                    <div className="text-3xl font-bold text-gray-900">
                      {tier.price}
                      <span className="text-sm font-normal text-gray-500">{tier.period}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {tier.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    <Button 
                      className={`w-full mt-6 ${
                        tier.popular 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-gray-900 hover:bg-gray-800'
                      }`}
                      onClick={() => setSelectedTier(tier.name)}
                      data-testid={`button-select-${tier.name.toLowerCase().replace(' ', '-')}`}
                    >
                      {selectedTier === tier.name ? 'Selected' : 'Choose Plan'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Overview */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Join Our Privilege Club?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Gift,
                title: 'Exclusive Rewards',
                description: 'Get special discounts and rewards just for being a member'
              },
              {
                icon: Heart,
                title: 'Pet Care Support',
                description: '24/7 access to pet care experts and veterinary advice'
              },
              {
                icon: Star,
                title: 'Premium Products',
                description: 'Early access to new and premium pet products'
              },
              {
                icon: Crown,
                title: 'VIP Treatment',
                description: 'Priority service and personalized pet care solutions'
              }
            ].map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <IconComponent className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}