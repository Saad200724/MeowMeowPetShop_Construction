/**
 * Advanced SEO Helper Functions
 * Powerful utilities to outrank competitors
 */

export function setAdvancedSEO(config: {
  title: string;
  description: string;
  keywords?: string;
  longTail?: string[];
  schema?: Record<string, any>[];
  breadcrumbs?: Array<{name: string, url: string}>;
  author?: string;
  datePublished?: string;
  dateModified?: string;
}) {
  // 1. Set advanced title with power words
  const powerWords = ['Best', 'Complete', 'Ultimate', 'Top', 'Premium', 'Professional'];
  document.title = config.title;

  // 2. Set comprehensive meta tags
  setMetaTag('description', config.description);
  setMetaTag('og:description', config.description);
  setMetaTag('twitter:description', config.description);
  
  // 3. Set keywords with long-tail variants
  if (config.keywords) {
    setMetaTag('keywords', config.keywords);
  }
  
  if (config.longTail && config.longTail.length > 0) {
    const allKeywords = [config.keywords, ...config.longTail].filter(Boolean).join(', ');
    setMetaTag('keywords', allKeywords);
  }

  // 4. Add author and publication dates for freshness signal
  if (config.author) {
    setMetaTag('author', config.author);
  }
  
  if (config.datePublished) {
    setMetaTag('article:published_time', config.datePublished);
  }
  
  if (config.dateModified) {
    setMetaTag('article:modified_time', config.dateModified);
  }

  // 5. Set multiple schema markups for rich snippets
  if (config.schema && config.schema.length > 0) {
    config.schema.forEach((schema, index) => {
      setSchemaScript(schema, `schema-${index}`);
    });
  }

  // 6. Set breadcrumbs for better internal linking
  if (config.breadcrumbs && config.breadcrumbs.length > 0) {
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": config.breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url
      }))
    };
    setSchemaScript(breadcrumbSchema, 'breadcrumbs');
  }

  // 7. Add additional SEO meta tags
  addSEOMetaTags();
  
  // 8. Trigger Core Web Vitals optimization
  optimizeCoreWebVitals();
}

function setMetaTag(name: string, content: string) {
  let tag = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
  
  if (!tag) {
    tag = document.createElement('meta');
    const isProperty = name.includes(':');
    if (isProperty) {
      tag.setAttribute('property', name);
    } else {
      tag.setAttribute('name', name);
    }
    document.head.appendChild(tag);
  }
  
  tag.setAttribute('content', content);
}

function setSchemaScript(schema: Record<string, any>, id: string) {
  let script = document.querySelector(`script[data-schema-id="${id}"]`);
  
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema-id', id);
    document.head.appendChild(script);
  }
  
  script.textContent = JSON.stringify(schema);
}

function addSEOMetaTags() {
  // Robots meta
  setMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  
  // Language
  setMetaTag('Content-Language', 'en-BD');
  
  // Distribution
  setMetaTag('distribution', 'global');
  
  // Rating
  setMetaTag('rating', 'General');
  
  // Revisit
  setMetaTag('revisit-after', '7 days');
  
  // Copyright
  setMetaTag('copyright', 'Meow Meow Pet Shop Bangladesh');
}

function optimizeCoreWebVitals() {
  // Lazy load images
  const images = document.querySelectorAll('img:not([loading="lazy"])');
  images.forEach(img => {
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
  });

  // Preload critical resources
  const head = document.head;
  const criticalLink = document.createElement('link');
  criticalLink.rel = 'preload';
  criticalLink.as = 'style';
  criticalLink.href = '/src/index.css';
  head.appendChild(criticalLink);
}

/**
 * Generate SEO metadata for product pages
 */
export function generateProductSEO(product: {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  brand: string;
  rating: number;
  reviews: number;
  category: string;
  tags: string[];
}) {
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "@id": `https://meowmeowpetshop.com/product/${product.id}`,
    "name": product.name,
    "image": product.image,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Meow Meow Pet Shop"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "Meow Meow Pet Shop"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://meowmeowpetshop.com/product/${product.id}`,
      "priceCurrency": "BDT",
      "price": product.price.toString(),
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Meow Meow Pet Shop",
        "url": "https://meowmeowpetshop.com"
      }
    },
    "aggregateRating": product.reviews > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": Math.min(5, product.rating).toString(),
      "reviewCount": product.reviews.toString(),
      "bestRating": "5",
      "worstRating": "1"
    } : undefined,
    "keywords": [product.name, product.category, ...product.tags].join(", "),
    "category": product.category
  };

  const title = `${product.name} - Buy Online | Meow Meow Pet Shop Bangladesh`;
  const description = `${product.name} in Bangladesh. Price: BDT ${product.price}. ${product.description} Buy online with fast delivery. Quality guaranteed.`;
  const keywords = `${product.name}, ${product.category}, pet food, pet supplies, buy online, Bangladesh, ${product.tags.join(', ')}`;

  return {
    title,
    description,
    keywords,
    schema: [schema],
    breadcrumbs: [
      { name: "Home", url: "https://meowmeowpetshop.com" },
      { name: product.category, url: `https://meowmeowpetshop.com/${product.category.toLowerCase()}` },
      { name: product.name, url: `https://meowmeowpetshop.com/product/${product.id}` }
    ]
  };
}

/**
 * Generate category page SEO
 */
export function generateCategorySEO(category: {
  name: string;
  description: string;
  url: string;
  productCount: number;
  image: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": category.name,
    "description": category.description,
    "url": `https://meowmeowpetshop.com${category.url}`,
    "image": category.image,
    "numberOfItems": category.productCount,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": category.productCount
    }
  };

  const title = `${category.name} - Best Selection Online | Meow Meow Pet Shop BD`;
  const description = `${category.description} Shop ${category.productCount}+ premium products. Fast delivery across Bangladesh. Quality guaranteed. Best prices. 24/7 support.`;
  const keywords = `${category.name}, buy ${category.name.toLowerCase()}, ${category.name.toLowerCase()} Bangladesh, online pet shop, fast delivery, quality products`;

  return {
    title,
    description,
    keywords,
    schema: [schema]
  };
}

/**
 * Generate blog/article SEO
 */
export function generateArticleSEO(article: {
  title: string;
  description: string;
  content: string;
  author: string;
  publishedDate: string;
  modifiedDate: string;
  image: string;
  tags: string[];
  url: string;
}) {
  const wordCount = article.content.split(' ').length;
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "description": article.description,
    "image": article.image,
    "author": {
      "@type": "Organization",
      "name": article.author || "Meow Meow Pet Shop"
    },
    "datePublished": article.publishedDate,
    "dateModified": article.modifiedDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://meowmeowpetshop.com${article.url}`
    },
    "wordCount": wordCount,
    "articleBody": article.content
  };

  return {
    title: article.title,
    description: article.description,
    keywords: article.tags.join(", "),
    schema: [schema],
    author: article.author,
    datePublished: article.publishedDate,
    dateModified: article.modifiedDate
  };
}

/**
 * Optimize for featured snippets
 */
export function optimizeForFeaturedSnippets(type: 'paragraph' | 'list' | 'table', content: any) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Thing",
    "description": typeof content === 'string' ? content : JSON.stringify(content)
  };
  
  return schema;
}

/**
 * Generate FAQ page schema
 */
export function generateFAQSchema(faqs: Array<{question: string, answer: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };
}
