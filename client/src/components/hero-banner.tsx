import bannerImage from "@assets/Banner_1753440909945.jpg";

export default function HeroBanner() {
  return (
    <section className="w-full">
      <div className="hero-banner-wrapper">
        <div className="hero-banner-content">
          <img
            src={bannerImage}
            alt="Meow Meow Pet Shop - Everything You Need"
            loading="eager"
            onLoad={() => console.log("Banner loaded successfully")}
            onError={(e) => {
              console.error("Banner failed to load:", e);
              console.log("Trying fallback image path...");
            }}
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