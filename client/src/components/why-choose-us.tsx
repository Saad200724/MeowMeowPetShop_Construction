import { Award, Truck, Shield } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: Award,
      title: "Quality Products",
      description: "Premium pet food and accessories from trusted brands worldwide"
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Quick delivery across Bangladesh to get your pet's essentials on time"
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "Safe and secure payment options for your peace of mind"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Meow Meow Pet Shop?</h3>
          <p className="text-gray-600">Your pet's happiness is our priority</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="text-center">
                <div className="bg-accent-green text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-semibold mb-3">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
