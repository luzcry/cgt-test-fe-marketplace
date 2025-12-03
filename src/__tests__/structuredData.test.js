import { buildProductListSchema } from '../utils/structuredData';

describe('structuredData', () => {
  const mockOrigin = 'https://example.com';

  beforeEach(() => {
    delete window.location;
    window.location = { origin: mockOrigin };
  });

  describe('buildProductListSchema', () => {
    it('builds valid Schema.org ItemList structure', () => {
      const products = [
        {
          id: '1',
          name: 'Test Model',
          description: 'A test 3D model',
          image: '/images/test.jpg',
          category: 'Props',
          price: 49.99,
          currency: 'USD',
          rating: 4.5,
        },
      ];

      const schema = buildProductListSchema(products);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('ItemList');
      expect(schema.name).toBe('3D Models Marketplace');
      expect(schema.numberOfItems).toBe(1);
    });

    it('maps products to ListItem elements with correct positions', () => {
      const products = [
        {
          id: '1',
          name: 'First Model',
          description: 'First',
          image: '/img1.jpg',
          category: 'Props',
          price: 10,
          currency: 'USD',
          rating: 4,
        },
        {
          id: '2',
          name: 'Second Model',
          description: 'Second',
          image: '/img2.jpg',
          category: 'Vehicles',
          price: 20,
          currency: 'USD',
          rating: 5,
        },
      ];

      const schema = buildProductListSchema(products);

      expect(schema.itemListElement).toHaveLength(2);
      expect(schema.itemListElement[0].position).toBe(1);
      expect(schema.itemListElement[1].position).toBe(2);
      expect(schema.itemListElement[0]['@type']).toBe('ListItem');
      expect(schema.itemListElement[1]['@type']).toBe('ListItem');
    });

    it('includes correct Product schema for each item', () => {
      const products = [
        {
          id: 'abc-123',
          name: 'Dragon Model',
          description: 'A detailed dragon',
          image: '/dragon.jpg',
          category: 'Characters',
          price: 99.99,
          currency: 'EUR',
          rating: 4.8,
        },
      ];

      const schema = buildProductListSchema(products);
      const product = schema.itemListElement[0].item;

      expect(product['@type']).toBe('Product');
      expect(product['@id']).toBe(`${mockOrigin}/products/abc-123`);
      expect(product.name).toBe('Dragon Model');
      expect(product.description).toBe('A detailed dragon');
      expect(product.image).toBe('/dragon.jpg');
      expect(product.category).toBe('Characters');
    });

    it('includes correct Offer schema with price and currency', () => {
      const products = [
        {
          id: '1',
          name: 'Test',
          description: 'Test',
          image: '/test.jpg',
          category: 'Props',
          price: 149.99,
          currency: 'USD',
          rating: 4,
        },
      ];

      const schema = buildProductListSchema(products);
      const offer = schema.itemListElement[0].item.offers;

      expect(offer['@type']).toBe('Offer');
      expect(offer.price).toBe(149.99);
      expect(offer.priceCurrency).toBe('USD');
      expect(offer.availability).toBe('https://schema.org/InStock');
    });

    it('includes correct AggregateRating schema', () => {
      const products = [
        {
          id: '1',
          name: 'Test',
          description: 'Test',
          image: '/test.jpg',
          category: 'Props',
          price: 50,
          currency: 'USD',
          rating: 3.7,
        },
      ];

      const schema = buildProductListSchema(products);
      const rating = schema.itemListElement[0].item.aggregateRating;

      expect(rating['@type']).toBe('AggregateRating');
      expect(rating.ratingValue).toBe(3.7);
      expect(rating.bestRating).toBe(5);
      expect(rating.worstRating).toBe(1);
    });

    it('handles empty product array', () => {
      const schema = buildProductListSchema([]);

      expect(schema.numberOfItems).toBe(0);
      expect(schema.itemListElement).toHaveLength(0);
    });
  });
});
