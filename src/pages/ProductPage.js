import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../data/products';
import { useCart } from '../context/CartContext';
import './ProductPage.css';

function ProductPage() {
  const { productId } = useParams();
  const { addToCart } = useCart();
  const product = getProductById(productId);

  if (!product) {
    return (
      <div className="product-page product-page--not-found">
        <h1>Product not found</h1>
        <p>The product you're looking for doesn't exist.</p>
        <Link to="/" className="product-page__back-link">
          Back to Home
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="product-page">
      <Link to="/" className="product-page__back-link">
        ← Back to Products
      </Link>
      <div className="product-page__content">
        <div className="product-page__image-container">
          <img
            src={product.image}
            alt={product.name}
            className="product-page__image"
          />
        </div>
        <div className="product-page__details">
          <h1 className="product-page__title">{product.name}</h1>
          <p className="product-page__price">
            {product.price} {product.currency}
          </p>
          <p className="product-page__description">{product.description}</p>
          <button
            className="product-page__add-to-cart"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
