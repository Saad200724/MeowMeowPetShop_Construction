import { Router } from 'express';

const sitemapRouter = Router();

const baseUrl = 'https://meowshopbd.me';

const mainRoutes = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/products', priority: '0.9', changefreq: 'daily' },
  { path: '/cat-food', priority: '0.9', changefreq: 'weekly' },
  { path: '/dog-food', priority: '0.9', changefreq: 'weekly' },
  { path: '/cat-toys', priority: '0.8', changefreq: 'weekly' },
  { path: '/cat-litter', priority: '0.8', changefreq: 'weekly' },
  { path: '/cat-care', priority: '0.8', changefreq: 'weekly' },
  { path: '/cat-accessories', priority: '0.8', changefreq: 'weekly' },
  { path: '/dog-accessories', priority: '0.8', changefreq: 'weekly' },
  { path: '/clothing-beds-carrier', priority: '0.8', changefreq: 'weekly' },
  { path: '/rabbit', priority: '0.7', changefreq: 'monthly' },
  { path: '/bird', priority: '0.7', changefreq: 'monthly' },
  { path: '/brands', priority: '0.8', changefreq: 'weekly' },
  { path: '/blog', priority: '0.8', changefreq: 'daily' },
  { path: '/bulk-discounts', priority: '0.7', changefreq: 'monthly' },
  { path: '/privilege-club', priority: '0.7', changefreq: 'monthly' },
  { path: '/flash-sale-products', priority: '0.9', changefreq: 'daily' },
  { path: '/newly-launched', priority: '0.8', changefreq: 'weekly' },
  { path: '/about', priority: '0.6', changefreq: 'monthly' },
  { path: '/contact', priority: '0.5', changefreq: 'monthly' },
  { path: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
  { path: '/return-policy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms-of-service', priority: '0.3', changefreq: 'yearly' },
  { path: '/shipping-policy', priority: '0.3', changefreq: 'yearly' },
  { path: '/quality-guarantee', priority: '0.3', changefreq: 'yearly' },
];

const brandRoutes = [
  { path: '/brands/reflex', priority: '0.7', changefreq: 'monthly' },
  { path: '/brands/nekko', priority: '0.7', changefreq: 'monthly' },
  { path: '/brands/purina', priority: '0.7', changefreq: 'monthly' },
  { path: '/brands/one', priority: '0.7', changefreq: 'monthly' },
  { path: '/brands/reflex-plus', priority: '0.7', changefreq: 'monthly' },
  { path: '/brands/royal-canin', priority: '0.7', changefreq: 'monthly' },
  { path: '/brands/sheba', priority: '0.7', changefreq: 'monthly' },
];

function generateSitemapXml(routes: typeof mainRoutes) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  routes.forEach(route => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}${route.path}</loc>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  return xml;
}

sitemapRouter.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  res.send(generateSitemapXml([...mainRoutes, ...brandRoutes]));
});

sitemapRouter.get('/sitemap-index.xml', (req, res) => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  xml += '  <sitemap>\n';
  xml += `    <loc>${baseUrl}/sitemap.xml</loc>\n`;
  xml += '  </sitemap>\n';
  xml += '</sitemapindex>';
  
  res.type('application/xml');
  res.send(xml);
});

// Route for robots.txt meta information
sitemapRouter.get('/.well-known/security.txt', (req, res) => {
  res.type('text/plain');
  res.send(`Contact: mailto:meowmeowpetshop1@gmail.com
Expires: ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()}
`);
});

export default sitemapRouter;
