import React, { useEffect, useState } from 'react';
import { useStateValue } from '../../Context/StateProvider';
import SellerProduct from '../../components/SellerProduct';
import './Home.css';

const Home = () => {
  const [{ products }, dispatch] = useStateValue();
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    // Sort products by date added and select the latest 20
    const sortedProducts = products.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    const latest20Products = sortedProducts.slice(0, 20);
    setLatestProducts(latest20Products);
  }, [products]);

  return (
    <div className="home">
      <h2 className="latest_products_title">Latest Products</h2>
      <div className="product-list">
        {latestProducts.map((product) => (
          <SellerProduct className='latesh_product' key={product.id} id={product.id} />
        ))}
      </div>
    </div>
  );
};

export default Home;
