import { Link } from 'react-router-dom';
import { products } from '../data/products';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home">
      <h1 className="home__title">Welcome to our shop!</h1>
      <div className="home__products">
        {products.map((product) => (
          <div key={product.id} className="home__product-card">
            <Link to={`/products/${product.id}`} className="home__product-link">
              <img
                src={product.image}
                alt={product.name}
                className="home__product-image"
              />
              <h2 className="home__product-name">{product.name}</h2>
              <p className="home__product-price">
                {product.price} {product.currency}
              </p>
            </Link>
            <p className="home__product-description">{product.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
