import { useEffect } from 'react';

export const updateSEOMetadata = ({ title, description, image, url, productSchema }) => {
  // Update Title
  document.title = title ? `${title} | NexusMart` : 'NexusMart | Premium Online Shopping';

  // Update Meta Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.name = 'description';
    document.head.appendChild(metaDesc);
  }
  metaDesc.content = description || 'Shop thousands of top-tier electronics, fashion, and lifestyle deals at NexusMart.';

  // Update OpenGraph Title
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) {
    ogTitle = document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    document.head.appendChild(ogTitle);
  }
  ogTitle.content = title || 'NexusMart Storefront';

  // Update OpenGraph Description
  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (!ogDesc) {
    ogDesc = document.createElement('meta');
    ogDesc.setAttribute('property', 'og:description');
    document.head.appendChild(ogDesc);
  }
  ogDesc.content = description || 'Explore premium products, flash sales, and fast delivery at NexusMart.';

  // JSON-LD Product Schema Insertion
  if (productSchema) {
    let scriptTag = document.getElementById('json-ld-product-schema');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'json-ld-product-schema';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify({
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: productSchema.name,
      image: productSchema.images || [],
      description: productSchema.description,
      brand: {
        '@type': 'Brand',
        name: productSchema.brand || 'NexusMart',
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'INR',
        price: productSchema.price,
        availability: 'https://schema.org/InStock',
      },
      aggregateRating: productSchema.rating ? {
        '@type': 'AggregateRating',
        ratingValue: productSchema.rating,
        reviewCount: productSchema.numReviews || 120,
      } : undefined,
    });
  }
};

export const useSEO = ({ title, description, image, url, productSchema }) => {
  useEffect(() => {
    updateSEOMetadata({ title, description, image, url, productSchema });
  }, [title, description, image, url, productSchema]);
};
