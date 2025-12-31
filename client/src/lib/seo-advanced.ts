/**
 * ADVANCED SEO SYSTEM FOR MEOW MEOW PET SHOP
 * This file contains enterprise-level SEO configurations
 */

export const advancedSEOConfig = {
  domain: 'meowmeowpetshop.com',
  locale: 'en_BD',
  language: 'en',
  country: 'Bangladesh',
  
  // Rich snippets for products
  productSchema: (product: any) => ({
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.image,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": "Meow Meow Pet Shop"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://meowmeowpetshop.com/product/${product.id}`,
      "priceCurrency": "BDT",
      "price": product.price,
      "priceValidUntil": "2025-12-31",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Meow Meow Pet Shop"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating || "4.5",
      "reviewCount": product.reviews || "100"
    }
  }),

  // FAQ Schema
  faqSchema: (faqs: Array<{q: string, a: string}>) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  }),

  // BreadcrumbList Schema
  breadcrumbSchema: (items: Array<{name: string, url: string}>) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }),

  // Organization Schema with all details
  organizationSchema: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://meowmeowpetshop.com#organization",
    "name": "Meow Meow Pet Shop",
    "url": "https://meowmeowpetshop.com",
    "logo": "https://meowmeowpetshop.com/logo.png",
    "image": "https://meowmeowpetshop.com/banner.jpg",
    "description": "Bangladesh's leading online pet food and accessories store providing premium cat food, dog food, and pet supplies with fast delivery and quality guarantee.",
    "email": "meowmeowpetshop1@gmail.com",
    "telephone": "+880-1405-045023",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Savar",
      "addressLocality": "Dhaka",
      "addressRegion": "Dhaka",
      "postalCode": "1340",
      "addressCountry": "BD"
    },
    "contact": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "telephone": "+880-1405-045023",
      "availableLanguage": ["en", "bn"]
    },
    "sameAs": [
      "https://www.facebook.com/meow.meow.pet.shop1",
      "https://www.instagram.com/meow_meow_pet_shop",
      "https://wa.me/8801838511583"
    ],
    "knowsAbout": [
      "Pet Food",
      "Cat Food",
      "Dog Food",
      "Pet Accessories",
      "Pet Supplies",
      "Pet Care",
      "Pet Health",
      "Bangladesh"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Pet Food & Supplies",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "Cat Food",
          "url": "https://meowmeowpetshop.com/cat-food"
        },
        {
          "@type": "OfferCatalog",
          "name": "Dog Food",
          "url": "https://meowmeowpetshop.com/dog-food"
        },
        {
          "@type": "OfferCatalog",
          "name": "Pet Accessories",
          "url": "https://meowmeowpetshop.com/cat-accessories"
        }
      ]
    }
  },

  // AggregateOffer for better visibility
  aggregateOfferSchema: {
    "@context": "https://schema.org",
    "@type": "AggregateOffer",
    "priceCurrency": "BDT",
    "lowPrice": "100",
    "highPrice": "100000",
    "offerCount": 500,
    "seller": {
      "@type": "Organization",
      "name": "Meow Meow Pet Shop",
      "url": "https://meowmeowpetshop.com"
    }
  },

  // Action Schema for Better CTAs
  actionSchema: (actionName: string, url: string) => ({
    "@context": "https://schema.org",
    "@type": "BuyAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": url,
      "actionPlatform": ["DesktopWebPlatform", "MobileWebPlatform"]
    }
  }),

  // Event Schema for promotions
  eventSchema: (eventName: string, description: string, startDate: string, endDate: string) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    "name": eventName,
    "description": description,
    "startDate": startDate,
    "endDate": endDate,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
    "organizer": {
      "@type": "Organization",
      "name": "Meow Meow Pet Shop",
      "url": "https://meowmeowpetshop.com"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://meowmeowpetshop.com"
    }
  })
};

// Advanced Meta Tag Configuration
export const advancedMetaTags = {
  // Cache and Performance
  cacheControl: "public, max-age=3600, s-maxage=86400",
  
  // Security Headers
  xUACompatible: "IE=edge",
  referrerPolicy: "strict-origin-when-cross-origin",
  
  // Mobile & Viewport
  viewport: "width=device-width, initial-scale=1.0, viewport-fit=cover",
  mobileAlternate: "https://meowmeowpetshop.com",
  
  // Apple
  appleMobileWebAppCapable: "yes",
  appleMobileWebAppStatusBarStyle: "black-translucent",
  appleFormatDetection: "telephone=no",
  
  // Windows
  msapplicationConfig: "/browserconfig.xml",
  msapplicationTileColor: "#1a5f3f",
  msapplicationTileImage: "/logo.png",
  
  // Additional SEO Signals
  formatDetection: "telephone=no",
  imageAlt: "All product images have descriptive alt text",
  
  // Preload Critical Resources
  preloadFonts: [
    { href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap", as: "style" }
  ]
};

// Keyword Density Configuration
export const keywordDensity = {
  primary: 1.5, // 1.5% for main keyword
  secondary: 0.8, // 0.8% for secondary keywords
  lsi: 0.5, // 0.5% for LSI keywords
  optimal: [1.0, 2.0] // Optimal range 1-2%
};

// Content Quality Guidelines
export const contentQuality = {
  minWordCount: 300,
  optimalWordCount: 1500,
  headingHierarchy: ["h1", "h2", "h3"], // Never skip levels
  imageAltText: "Required for all images",
  internalLinks: "3-5 per 1000 words",
  externalLinks: "2-3 per 1000 words",
  readabilityScore: "Flesch Reading Ease 60-70"
};

// Competitor Analysis Configuration
export const competitorAnalysis = {
  competitors: [
    {
      name: "Mew Mew Shop BD",
      domain: "mewmewshopbd.com",
      strengths: "Good meta descriptions, basic schema",
      weaknesses: "Limited structured data, poor mobile SEO, weak internal linking"
    }
  ],
  competitorBeating: {
    strategy: "Implement advanced schema markup, superior content, better UX",
    tactics: [
      "Product rich snippets on all items",
      "FAQ schema for better SERP features",
      "Better breadcrumb implementation",
      "More comprehensive content",
      "Superior mobile experience",
      "Faster page load times"
    ]
  }
};

// Local SEO Optimization
export const localSEOConfig = {
  businessName: "Meow Meow Pet Shop",
  serviceArea: "Bangladesh",
  address: "Savar, Dhaka, Bangladesh",
  phone: "+880-1405-045023",
  hours: {
    monday: { open: "09:00", close: "21:00" },
    tuesday: { open: "09:00", close: "21:00" },
    wednesday: { open: "09:00", close: "21:00" },
    thursday: { open: "09:00", close: "21:00" },
    friday: { open: "09:00", close: "21:00" },
    saturday: { open: "09:00", close: "21:00" },
    sunday: { open: "09:00", close: "21:00" }
  },
  gmb: {
    category: "Pet Store",
    serviceType: "Online Pet Food Delivery"
  }
};

// Mobile SEO
export const mobileSEO = {
  responsiveDesign: true,
  fastLoading: "< 3 seconds",
  touchFriendly: true,
  mobileViewport: "fixed",
  avoidInterstitials: true,
  mobileFirstIndexing: true
};

// Performance Metrics
export const performanceTargets = {
  lighthouse: {
    performance: 90,
    accessibility: 95,
    bestPractices: 90,
    seo: 100
  },
  coreLiveWeb: {
    largestContentfulPaint: 2.5, // seconds
    firstInputDelay: 100, // milliseconds
    cumulativeLayoutShift: 0.1
  },
  pageSpeed: {
    minDomInteractive: 1.5,
    maxServerResponseTime: 0.6,
    minVisuallyComplete: 2.0
  }
};

// Ranking Strategies
export const rankingStrategies = {
  contentDepth: "Comprehensive guides 2000+ words",
  topicalAuthority: "Deep coverage of pet care, nutrition, health",
  e_e_a_t: "Expertise, Experience, Authoritativeness, Trustworthiness",
  linkBuilding: "Quality backlinks from pet industry sites",
  userSignals: "High CTR, low bounce rate, long dwell time",
  freshContent: "Weekly blog updates on pet care topics",
  seasonalContent: "Monsoon, summer, winter pet care guides",
  videoContent: "Product demos, care tutorials, customer testimonials"
};

// Brand Authority Signals
export const brandAuthority = {
  name: "Meow Meow Pet Shop",
  tagline: "Bangladesh's Leading Online Pet Shop",
  claims: [
    "1000+ Happy Customers",
    "500+ Quality Products",
    "Fast Delivery Across Bangladesh",
    "Quality Guarantee",
    "24/7 Customer Support"
  ],
  certifications: [
    "Authentic Products",
    "Secure Payment",
    "Money Back Guarantee"
  ],
  reviews: "User reviews on every product",
  testimonials: "Customer success stories",
  socialProof: "Facebook likes, Instagram followers, customer reviews"
};
