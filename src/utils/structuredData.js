/**
 * Builds structured data (JSON-LD) for the product listing page.
 * @param {Array} products - Array of product objects
 * @returns {Object} Schema.org ItemList structured data
 */
export function buildProductListSchema(products) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: '3D Models Marketplace',
    description:
      'Premium 3D models and digital assets for creative professionals',
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        '@id': `${window.location.origin}/products/${product.id}`,
        name: product.name,
        description: product.description,
        image: product.image,
        category: product.category,
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: product.currency,
          availability: 'https://schema.org/InStock',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          bestRating: 5,
          worstRating: 1,
        },
      },
    })),
  };
}
