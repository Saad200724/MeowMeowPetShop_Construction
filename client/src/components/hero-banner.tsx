import bannerImage from "@assets/Banner_1753440909945.jpg";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden">
      {/* Single Banner */}
      <div className="relative">
        <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
          <img
            src={bannerImage}
            alt="Meow Meow Pet Shop - Everything You Need"
            className="w-full h-full object-contain bg-gray-100"
          />
        </div>
      </div>

      {/* Featured Categories Header */}
      <div className="bg-white py-4">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-purple-700 mb-2">
              FEATURED CATEGORIES
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}