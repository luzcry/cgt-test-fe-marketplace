import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import './HomePage.scss';

/**
 * HomePage Component
 *
 * Landing page with tech-forward hero section and product grid.
 * Features:
 * - Animated hero with floating particles and scanlines
 * - Responsive product grid with hover effects
 * - SEO-optimized heading hierarchy
 * - Accessible markup with ARIA labels
 */
function HomePage() {
  const { addToCart } = useCart();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero" aria-labelledby="hero-title">
        {/* Animated Background */}
        <div className="hero__background" aria-hidden="true" />

        {/* Floating Particles */}
        <div className="hero__particles" aria-hidden="true">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="hero__particle" />
          ))}
        </div>

        {/* Hero Content */}
        <div className="hero__content">
          <div className="hero__grid">
            {/* Left: Text Content */}
            <div className="hero__text">
              <span className="hero__badge">Premium Marketplace</span>

              <h1 id="hero-title" className="hero__title">
                <span className="hero__title-line">Next-Gen</span>
                <span className="hero__title-line hero__title-gradient">Digital Assets</span>
              </h1>

              <p className="hero__description">
                Professional-grade digital products optimized for your projects.
                High-quality assets, instant downloads, industry-standard formats.
              </p>

              <div className="hero__features">
                <div className="hero__feature">
                  <span className="hero__feature-dot" aria-hidden="true" />
                  <span>Premium Quality</span>
                </div>
                <div className="hero__feature">
                  <span className="hero__feature-dot" aria-hidden="true" />
                  <span>Instant Download</span>
                </div>
                <div className="hero__feature">
                  <span className="hero__feature-dot" aria-hidden="true" />
                  <span>Secure Payment</span>
                </div>
              </div>

              <p className="hero__stats">
                <strong>{products.length}</strong> premium assets available
              </p>
            </div>

            {/* Right: Visual Element */}
            <div className="hero__visual" aria-hidden="true">
              <div className="hero__visual-ring" />
              <div className="hero__visual-ring hero__visual-ring--inner" />
              <div className="hero__visual-center">
                <span className="hero__visual-text">3D</span>
              </div>
              <div className="hero__corner hero__corner--tl" />
              <div className="hero__corner hero__corner--tr" />
              <div className="hero__corner hero__corner--bl" />
              <div className="hero__corner hero__corner--br" />
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products" aria-labelledby="products-title">
        <header className="products__header">
          <h2 id="products-title" className="products__title">All Products</h2>
          <p className="products__count">
            {products.length} {products.length === 1 ? 'product' : 'products'} available
          </p>
        </header>

        {products.length > 0 ? (
          <div className="products__grid" role="list">
            {products.map((product) => (
              <article
                key={product.id}
                className="product-card"
                role="listitem"
              >
                <Link
                  to={`/products/${product.id}`}
                  className="product-card__link"
                  aria-label={`View ${product.name} - ${product.price} ${product.currency}`}
                >
                  {/* Preview Area */}
                  <div className="product-card__preview">
                    <div
                      className="product-card__preview-bg"
                      style={{ '--preview-color': product.previewColor }}
                    >
                      <span className="product-card__preview-text" aria-hidden="true">3D</span>
                    </div>
                    {product.image && (
                      <img
                        src={product.image}
                        alt=""
                        className="product-card__image"
                        loading="lazy"
                      />
                    )}
                    {product.rating && (
                      <div className="product-card__rating">
                        <svg
                          className="product-card__rating-icon"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <span>{product.rating}</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="product-card__content">
                    {product.category && (
                      <p className="product-card__category">{product.category}</p>
                    )}
                    <h3 className="product-card__name">{product.name}</h3>
                    <p className="product-card__description">{product.description}</p>
                    <p className="product-card__price">
                      ${product.price}
                    </p>
                  </div>
                </Link>

                {/* Add to Cart Button */}
                <div className="product-card__cta">
                  <button
                    type="button"
                    className="product-card__btn"
                    onClick={() => addToCart(product)}
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <svg
                      className="product-card__btn-icon"
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
              </article>
            ))}
          </div>
        ) : (
          <div className="products__empty">
            <svg
              className="products__empty-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <p className="products__empty-text">No products available</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;
