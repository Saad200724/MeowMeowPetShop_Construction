export default function FeaturedBrands() {
  const brands = [
    'ROYAL CANIN',
    'HILLS',
    'PEDIGREE', 
    'WHISKAS',
    'PURINA',
    'IAMS'
  ];

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl font-bold text-center text-meow-green mb-6">Featured Brands</h3>
        <div className="flex items-center justify-center space-x-8 overflow-x-auto">
          {brands.map((brand, index) => (
            <div key={index} className="flex flex-col items-center min-w-32 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-24 h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                <span className="text-gray-600 font-bold text-xs text-center">{brand}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
