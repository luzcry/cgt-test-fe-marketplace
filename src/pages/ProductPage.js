import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById } from '../data/products';
import { useCart } from '../context/CartContext';
import './ProductPage.scss';

/**
 * ProductPage Component
 *
 * Detailed product view with image viewer and purchase options.
 * Features:
 * - Two-column responsive layout
 * - Sticky image viewer on desktop
 * - Sticky price/action section
 * - Accessible markup with proper heading hierarchy
 * - SEO-optimized structure
 */
function ProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = getProductById(productId);

  // Not found state
  if (!product) {
    return (
      <div className="product-page product-page--not-found">
        <h1 className="product-page__not-found-title">Product Not Found</h1>
        <p className="product-page__not-found-text">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <button
          type="button"
          className="product-page__not-found-btn"
          onClick={() => navigate('/')}
        >
          Back to Products
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
  };

  // Features list (can be extended from product data)
  const features = [
    'High-quality digital asset',
    'Instant download after purchase',
    'Lifetime access',
    'Commercial license included',
  ];

  return (
    <main className="product-page">
      {/* Back Navigation */}
      <nav className="product-page__nav" aria-label="Breadcrumb">
        <Link to="/" className="product-page__back">
          <svg
            className="product-page__back-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Products
        </Link>
      </nav>

      {/* Main Content */}
      <div className="product-page__content">
        <div className="product-page__grid">
          {/* Left: Image Viewer */}
          <div className="product-page__viewer">
            <div className="product-page__image-container">
              <div
                className="product-page__image-bg"
                style={{ '--preview-color': product.previewColor }}
              >
                <span className="product-page__image-placeholder" aria-hidden="true">
                  3D
                </span>
              </div>
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-page__image"
                />
              )}
            </div>
            <p className="product-page__image-hint">
              High-resolution preview
            </p>
          </div>

          {/* Right: Product Details */}
          <article className="product-page__details">
            {/* Header */}
            <header className="product-page__header">
              {product.category && (
                <p className="product-page__category">{product.category}</p>
              )}
              <h1 className="product-page__title">{product.name}</h1>
              {product.rating && (
                <div className="product-page__rating">
                  <div className="product-page__rating-stars">
                    <svg
                      className="product-page__rating-icon"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span className="product-page__rating-value">{product.rating}</span>
                  </div>
                  <span className="product-page__rating-count">(Premium Asset)</span>
                </div>
              )}
            </header>

            {/* Description */}
            <p className="product-page__description">{product.description}</p>

            {/* Tags */}
            <div className="product-page__tags" aria-label="Product tags">
              <span className="product-page__tag">#premium</span>
              <span className="product-page__tag">#digital</span>
              <span className="product-page__tag">#instant-download</span>
            </div>

            {/* Specifications */}
            <section className="product-page__specs" aria-labelledby="specs-title">
              <h2 id="specs-title" className="product-page__specs-title">
                Specifications
              </h2>
              <div className="product-page__specs-grid">
                <div>
                  <p className="product-page__spec-label">Category</p>
                  <p className="product-page__spec-value">{product.category || 'Digital Asset'}</p>
                </div>
                <div>
                  <p className="product-page__spec-label">Format</p>
                  <p className="product-page__spec-value">Digital Download</p>
                </div>
                <div>
                  <p className="product-page__spec-label">License</p>
                  <p className="product-page__spec-value">Commercial</p>
                </div>
                <div>
                  <p className="product-page__spec-label">Support</p>
                  <p className="product-page__spec-value">Lifetime</p>
                </div>
              </div>
            </section>

            {/* Features */}
            <section className="product-page__features" aria-labelledby="features-title">
              <h2 id="features-title" className="product-page__features-title">
                What's Included
              </h2>
              {features.map((feature) => (
                <div key={feature} className="product-page__feature">
                  <span className="product-page__feature-icon" aria-hidden="true">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span className="product-page__feature-text">{feature}</span>
                </div>
              ))}
            </section>

            {/* Sticky Price & Actions */}
            <div className="product-page__actions">
              <div className="product-page__price-row">
                <div>
                  <p className="product-page__price-label">Price</p>
                  <p className="product-page__price">${product.price}</p>
                </div>
              </div>
              <div className="product-page__buttons">
                <button
                  type="button"
                  className="product-page__add-btn"
                  onClick={handleAddToCart}
                  aria-label={`Add ${product.name} to cart for $${product.price}`}
                >
                  <svg
                    className="product-page__add-btn-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  Add to Cart
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}

export default ProductPage;
