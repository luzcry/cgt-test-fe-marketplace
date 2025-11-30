import pictureA from '../a.jpg';
import pictureB from '../b.jpg';

export const products = [
  {
    id: 'a',
    name: 'Product A',
    price: 10,
    currency: 'USD',
    image: pictureA,
    description: 'You are probably interested in this product.',
  },
  {
    id: 'b',
    name: 'Product B',
    price: 30,
    currency: 'USD',
    image: pictureB,
    description: 'Check out the newest product!',
  },
];

export const getProductById = (id) => {
  return products.find((product) => product.id === id);
};
