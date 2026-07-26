import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/seller/dashboard/'],
    },
    sitemap: 'https://petstan.vercel.app/sitemap.xml',
  };
}
