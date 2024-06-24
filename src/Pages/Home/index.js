import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom'
import { useStateValue } from '../../Context/StateProvider';

import SellerProduct from '../../components/SellerProduct';
import './Home.css';

const Home = () => {
  const [{ userLoggedIn, products }, dispatch] = useStateValue();
  const [latestProducts, setLatestProducts] = useState([]);
  const sellerId = '666b3653a34c6e81d0f94b0e';
  const navigate = useNavigate()
  useEffect(() => {
    if (!userLoggedIn){
      navigate('/signin')
    }
  }, [userLoggedIn])
  
  useEffect(() => {
    if (products.length > 0) {
      // const sellerProducts = products.filter(product => product.seller === sellerId);
      const sellerProducts = products
      console.log(sellerProducts)
      const sortedProducts = sellerProducts.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
      const latest20Products = sortedProducts.slice(0, 20);
      setLatestProducts(latest20Products);
    }
  }, [products, sellerId]);
  return (!userLoggedIn? <></>:
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
