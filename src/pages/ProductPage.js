import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getProductById } from '../data/products';
import { useCart } from '../context/CartContext';
import ModelViewer from '../components/ModelViewer';
import Button from '../components/Button';
import FeatureList from '../components/Feature';
import EmptyState from '../components/EmptyState';
import InfoGrid from '../components/InfoGrid';
import TagList from '../components/TagList';
import Rating from '../components/Rating';
import {
  BackArrowIcon,
  LayersIcon,
  CartIcon,
  SearchEmptyIcon,
} from '../components/Icons';
import './ProductPage.scss';

function ProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = getProductById(productId);

  if (!product) {
    return (
      <div className="product-page product-page--not-found">
        <Helmet>
          <title>Product Not Found | 3D Marketplace</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <EmptyState
          icon={<SearchEmptyIcon />}
          title="Product Not Found"
          description="The product you're looking for doesn't exist or has been removed."
          actionLabel="Back to Products"
          onAction={() => navigate('/')}
          headingLevel={1}
        />
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
  };

  const features = [
    'High-quality digital asset',
    'Instant download after purchase',
    'Lifetime access',
    'Commercial license included',
  ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    category: product.category,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: '3D Marketplace',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: '3D Marketplace',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      bestRating: '5',
      worstRating: '1',
      ratingCount: Math.floor(product.rating * 20), // Simulated review count
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Polygon Count',
        value: product.polyCount.toLocaleString(),
      },
      {
        '@type': 'PropertyValue',
        name: 'File Formats',
        value: product.fileFormat.join(', '),
      },
      {
        '@type': 'PropertyValue',
        name: '3D Preview Available',
        value: product.model ? 'Yes' : 'No',
      },
    ],
  };

  const metaDescription = `${product.name} - ${product.description} Available in ${product.fileFormat.join(', ')} formats. ${product.polyCount.toLocaleString()} polygons. $${product.price} USD.`;

  return (
    <main className="product-page">
      <Helmet>
        <title>{product.name} | 3D Marketplace</title>
        <meta name="description" content={metaDescription} />
        <meta
          name="keywords"
          content={`3D model, ${product.category}, ${product.tags.join(', ')}, ${product.fileFormat.join(', ')}`}
        />

        {/* Open Graph */}
        <meta property="og:type" content="product" />
        <meta
          property="og:title"
          content={`${product.name} | 3D Marketplace`}
        />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={product.image} />
        <meta property="product:price:amount" content={product.price} />
        <meta property="product:price:currency" content={product.currency} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${product.name} | 3D Marketplace`}
        />
        <meta name="twitter:description" content={metaDescription} />

        <link
          rel="canonical"
          href={`${window.location.origin}/products/${product.id}`}
        />

        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <nav className="product-page__nav" aria-label="Breadcrumb">
        <Link to="/" className="product-page__back">
          <BackArrowIcon className="product-page__back-icon" />
          Back to Products
        </Link>
      </nav>

      <div className="product-page__content">
        <div className="product-page__grid">
          <div className="product-page__viewer">
            <ModelViewer
              model={product.model}
              productName={product.name}
              fallbackImage={product.image}
              previewColor={product.previewColor}
            />
            <p className="product-page__image-hint">
              {product.model
                ? 'Interactive 3D preview available'
                : 'High-resolution preview'}
            </p>
          </div>

          <article
            className="product-page__details"
            itemScope
            itemType="https://schema.org/Product"
          >
            <meta itemProp="sku" content={product.id} />
            <meta itemProp="image" content={product.image} />

            <header className="product-page__header">
              {product.category && (
                <p className="product-page__category" itemProp="category">
                  {product.category}
                </p>
              )}
              <h1 className="product-page__title" itemProp="name">
                {product.name}
              </h1>
              {product.rating && (
                <Rating
                  value={product.rating}
                  label="(Premium Asset)"
                  className="product-page__rating"
                />
              )}
            </header>

            <p className="product-page__description" itemProp="description">
              {product.description}
            </p>

            <TagList
              tags={product.tags}
              ariaLabel="Product tags"
              className="product-page__tags"
            />

            <section
              className="product-page__specs"
              aria-labelledby="specs-title"
            >
              <h2 id="specs-title" className="product-page__specs-title">
                Technical Specifications
              </h2>
              <InfoGrid
                items={[
                  { label: 'Category', value: product.category },
                  {
                    label: 'Polygons',
                    value: product.polyCount.toLocaleString(),
                  },
                  { label: 'Formats', value: product.fileFormat.join(', ') },
                  { label: 'License', value: 'Commercial' },
                ]}
                columns={2}
                className="product-page__specs-grid"
              />
            </section>

            {product.model && (
              <div
                className="product-page__preview-badge"
                aria-label="3D preview available"
              >
                <LayersIcon />
                <span>Interactive 3D Preview Available</span>
              </div>
            )}

            <section
              className="product-page__features"
              aria-labelledby="features-title"
            >
              <h2 id="features-title" className="product-page__features-title">
                What's Included
              </h2>
              <FeatureList
                features={features}
                icon="check"
                className="product-page__feature-list"
              />
            </section>

            <div
              className="product-page__actions"
              itemProp="offers"
              itemScope
              itemType="https://schema.org/Offer"
            >
              <meta itemProp="priceCurrency" content={product.currency} />
              <meta
                itemProp="availability"
                content="https://schema.org/InStock"
              />
              <div className="product-page__price-row">
                <div>
                  <p className="product-page__price-label">Price</p>
                  <p
                    className="product-page__price"
                    itemProp="price"
                    content={product.price}
                  >
                    ${product.price}
                  </p>
                </div>
              </div>
              <div className="product-page__buttons">
                <Button
                  variant="primary"
                  size="lg"
                  className="product-page__add-btn"
                  onClick={handleAddToCart}
                  aria-label={`Add ${product.name} to cart for $${product.price}`}
                  icon={<CartIcon className="product-page__add-btn-icon" />}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}

export default ProductPage;
