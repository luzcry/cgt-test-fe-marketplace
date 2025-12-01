import pictureA from '../a.jpg';
import pictureB from '../b.jpg';

/**
 * Product catalog with enhanced metadata for the marketplace
 * Each product includes preview styling for card display
 */
export const products = [
  {
    id: 'a',
    name: 'Product A',
    price: 10,
    currency: 'USD',
    image: pictureA,
    description: 'You are probably interested in this product.',
    category: 'Digital Asset',
    rating: 4.8,
    previewColor: 'linear-gradient(135deg, #4A90E2, #357ABD)',
  },
  {
    id: 'b',
    name: 'Product B',
    price: 30,
    currency: 'USD',
    image: pictureB,
    description: 'Check out the newest product!',
    category: 'Premium Asset',
    rating: 4.9,
    previewColor: 'linear-gradient(135deg, #E94B8A, #C73E75)',
  },
];

/**
 * Find a product by its ID
 * @param {string} id - The product ID to search for
 * @returns {Object|undefined} The product object or undefined if not found
 */
export const getProductById = (id) => {
  return products.find((product) => product.id === id);
};
