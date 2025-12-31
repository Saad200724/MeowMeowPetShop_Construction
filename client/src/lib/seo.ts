interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  canonical?: string;
  schema?: Record<string, any>;
}

export function setSEO(config: SEOConfig) {
  // Set title
  document.title = config.title;

  // Set/update meta description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute('content', config.description);

  // Set/update keywords
  if (config.keywords) {
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', config.keywords);
  }

  // Set/update og:title
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) {
    ogTitle = document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    document.head.appendChild(ogTitle);
  }
  ogTitle.setAttribute('content', config.title);

  // Set/update og:description
  let ogDescription = document.querySelector('meta[property="og:description"]');
  if (!ogDescription) {
    ogDescription = document.createElement('meta');
    ogDescription.setAttribute('property', 'og:description');
    document.head.appendChild(ogDescription);
  }
  ogDescription.setAttribute('content', config.description);

  // Set/update og:image
  if (config.ogImage) {
    let ogImage = document.querySelector('meta[property="og:image"]');
    if (!ogImage) {
      ogImage = document.createElement('meta');
      ogImage.setAttribute('property', 'og:image');
      document.head.appendChild(ogImage);
    }
    ogImage.setAttribute('content', config.ogImage);
  }

  // Set/update og:url
  if (config.ogUrl) {
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', config.ogUrl);
  }

  // Set canonical URL
  if (config.canonical) {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', config.canonical);
  }

  // Set schema markup
  if (config.schema) {
    let schemaScript = document.querySelector('script[data-seo-schema]');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.setAttribute('type', 'application/ld+json');
      schemaScript.setAttribute('data-seo-schema', 'true');
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(config.schema);
  }

  // Add robots meta for page indexing
  let robotsMeta = document.querySelector('meta[name="robots"]');
  if (!robotsMeta) {
    robotsMeta = document.createElement('meta');
    robotsMeta.setAttribute('name', 'robots');
    robotsMeta.setAttribute('content', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    document.head.appendChild(robotsMeta);
  }

  // Add language
  let langMeta = document.querySelector('meta[http-equiv="Content-Language"]');
  if (!langMeta) {
    langMeta = document.createElement('meta');
    langMeta.setAttribute('http-equiv', 'Content-Language');
    langMeta.setAttribute('content', 'en-BD');
    document.head.appendChild(langMeta);
  }
}

export const seoMetadata = {
  home: {
    title: 'Meow Meow Pet Shop - Premium Pet Food & Accessories in Savar, Bangladesh',
    description: 'Shop premium cat food, dog food, and pet accessories at Meow Meow Pet Shop. Quality products, fast delivery across Dhaka, and guaranteed customer satisfaction. Best prices for pet lovers in Bangladesh.',
    keywords: 'pet shop, cat food, dog food, pet toys, pet accessories, Savar, Dhaka, Bangladesh, pet care, pet supplies, quality pet products',
  },
  products: {
    title: 'Cat & Dog Food Products | Pet Accessories - Meow Meow Pet Shop',
    description: 'Browse our wide selection of premium cat food, dog food, toys, and accessories. Quality guaranteed with fast delivery across Dhaka. Find the best products for your pets.',
    keywords: 'cat food products, dog food products, pet toys, pet accessories, pet supplies, quality products, Bangladesh',
  },
  catFood: {
    title: 'Premium Cat Food - Quality Cat Nutrition | Meow Meow Pet Shop',
    description: 'Discover premium cat food brands at Meow Meow Pet Shop. Nutritious options for kittens and adult cats. Fast delivery in Dhaka with quality guarantee.',
    keywords: 'cat food, premium cat nutrition, kitten food, cat supplements, cat diet, Bangladesh cat food',
  },
  dogFood: {
    title: 'Premium Dog Food - Quality Dog Nutrition | Meow Meow Pet Shop',
    description: 'Shop premium dog food brands for puppies and adult dogs. Complete nutrition for your beloved dogs. Quality guaranteed with fast delivery across Dhaka.',
    keywords: 'dog food, premium dog nutrition, puppy food, dog diet, dog supplements, Bangladesh dog food',
  },
  catToys: {
    title: 'Cat Toys & Entertainment | Meow Meow Pet Shop',
    description: 'Explore interactive cat toys, balls, scratchers, and entertainment products. Keep your cats happy and active with quality toys from Meow Meow Pet Shop.',
    keywords: 'cat toys, interactive toys, cat entertainment, scratchers, cat balls, cat products',
  },
  catLitter: {
    title: 'Cat Litter & Accessories | Meow Meow Pet Shop',
    description: 'Premium cat litter and litter box accessories. Quality products for cat hygiene and comfort. Fast delivery across Dhaka.',
    keywords: 'cat litter, litter box, cat hygiene, cat accessories, pet care',
  },
  catCare: {
    title: 'Cat Care Products & Health Supplies | Meow Meow Pet Shop',
    description: 'Complete cat care solutions including grooming, health, and wellness products. Quality cat care supplies for your feline friends.',
    keywords: 'cat care, cat grooming, cat health, wellness products, pet care supplies',
  },
  catAccessories: {
    title: 'Cat Accessories & Collars | Meow Meow Pet Shop',
    description: 'Stylish and functional cat accessories including collars, harnesses, and carriers. Quality products for cat safety and comfort.',
    keywords: 'cat accessories, cat collars, cat harnesses, cat carriers, pet accessories',
  },
  dogAccessories: {
    title: 'Dog Accessories & Gear | Meow Meow Pet Shop',
    description: 'Premium dog accessories including collars, leashes, harnesses, and carriers. Quality products for dog safety and comfort.',
    keywords: 'dog accessories, dog collars, dog leashes, dog harnesses, pet gear',
  },
  clothingBedsCarrier: {
    title: 'Pet Clothing, Beds & Carriers | Meow Meow Pet Shop',
    description: 'Comfortable and stylish pet clothing, beds, and carriers for cats and dogs. Quality products for pet comfort and safety.',
    keywords: 'pet clothing, pet beds, pet carriers, cat beds, dog beds, pet furniture',
  },
  rabbit: {
    title: 'Rabbit Food & Supplies | Meow Meow Pet Shop',
    description: 'Premium rabbit food, accessories, and care products. Quality supplies for healthy and happy rabbits.',
    keywords: 'rabbit food, rabbit supplies, rabbit care, rabbit products, pet food',
  },
  bird: {
    title: 'Bird Food & Supplies | Meow Meow Pet Shop',
    description: 'Quality bird food, toys, and care products. Everything your feathered friends need for health and happiness.',
    keywords: 'bird food, bird supplies, bird care, bird toys, pet food',
  },
  brands: {
    title: 'Pet Food Brands | Premium Quality | Meow Meow Pet Shop',
    description: 'Shop premium pet food brands including Royal Canin, Purina, and more. Quality guaranteed products for your pets.',
    keywords: 'pet brands, Royal Canin, Purina, pet food brands, quality brands',
  },
  about: {
    title: 'About Meow Meow Pet Shop | Pet Care Experts',
    description: 'Learn about Meow Meow Pet Shop. We are dedicated to providing premium pet products and excellent customer service in Bangladesh.',
    keywords: 'about us, pet shop, quality products, customer service, pet care',
  },
  contact: {
    title: 'Contact Us | Meow Meow Pet Shop',
    description: 'Get in touch with Meow Meow Pet Shop. We are here to help with any questions about our products and services.',
    keywords: 'contact us, support, customer service, pet shop',
  },
  blog: {
    title: 'Pet Care Blog | Tips & Advice | Meow Meow Pet Shop',
    description: 'Read helpful articles about pet care, nutrition, training, and wellness. Expert advice from Meow Meow Pet Shop.',
    keywords: 'pet blog, pet care tips, pet advice, pet nutrition, pet health',
  },
  privacyPolicy: {
    title: 'Privacy Policy | Meow Meow Pet Shop',
    description: 'Read our privacy policy to understand how we protect your data and privacy.',
    keywords: 'privacy policy, data protection, privacy',
  },
  returnPolicy: {
    title: 'Return Policy | Meow Meow Pet Shop',
    description: 'Learn about our return and exchange policy for complete customer satisfaction.',
    keywords: 'return policy, exchange, refund, customer satisfaction',
  },
  termsOfService: {
    title: 'Terms of Service | Meow Meow Pet Shop',
    description: 'Read our terms of service and conditions for using Meow Meow Pet Shop.',
    keywords: 'terms of service, conditions, legal',
  },
  shippingPolicy: {
    title: 'Shipping Policy | Fast Delivery | Meow Meow Pet Shop',
    description: 'Learn about our fast shipping and delivery options across Dhaka and Bangladesh.',
    keywords: 'shipping, delivery, fast shipping, shipping policy',
  },
  qualityGuarantee: {
    title: 'Quality Guarantee | Meow Meow Pet Shop',
    description: 'We guarantee the quality of all our products. Satisfaction assured or your money back.',
    keywords: 'quality guarantee, customer satisfaction, quality products',
  },
  bulkDiscounts: {
    title: 'Bulk Discounts | Wholesale Pet Products | Meow Meow Pet Shop',
    description: 'Get special bulk discounts for wholesale pet food and supplies. Perfect for pet shelters, cafes, and resellers.',
    keywords: 'bulk discounts, wholesale, bulk products, special prices',
  },
};
