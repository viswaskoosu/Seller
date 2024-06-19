import React, { useState, useEffect } from 'react';
import SellerProduct from '../../components/SellerProduct';
import './YourProducts.css';
import { useStateValue } from '../../Context/StateProvider';

const YourProducts = () => {
  const [{ products }, dispatch] = useStateValue();
  const sellerId = '66603c345186e77df89152ea';
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    const sellerProducts = products.filter(product => product.seller === sellerId);
    setFilteredProducts(sellerProducts);
  }, [products, sellerId]);

  const handleSortChange = (sortType) => {
    setSortBy(sortType);
    switch (sortType) {
      case 'rating-low':
        sortByRatingLowToHigh();
        break;
      case 'rating-high':
        sortByRatingHighToLow();
        break;
      case 'price-high':
        sortByPriceRangeMaxToMin();
        break;
      case 'price-low':
        sortByPriceRangeMinToMax();
        break;
      case 'reviews-high':
        sortByReviewsHighToLow();
        break;
      default:
        sortByRatingLowToHigh();
        break;
    }
  };

  const sortByRatingLowToHigh = () => {
    const sortedProducts = [...filteredProducts].sort((a, b) => a.rating - b.rating);
    setFilteredProducts(sortedProducts);
  };

  const sortByRatingHighToLow = () => {
    const sortedProducts = [...filteredProducts].sort((a, b) => b.rating - a.rating);
    setFilteredProducts(sortedProducts);
  };

  const sortByReviewsHighToLow = () => {
    const sortedProducts = [...filteredProducts].sort((a, b) => b.reviews.length - a.reviews.length);
    setFilteredProducts(sortedProducts);
  };

  const sortByPriceRangeMinToMax = () => {
    const sortedProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
    setFilteredProducts(sortedProducts);
  };

  const sortByPriceRangeMaxToMin = () => {
    const sortedProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
    setFilteredProducts(sortedProducts);
  };

  const handleUpdate = () => {
    const sellerProducts = products.filter(product => product.seller === sellerId);
    setFilteredProducts(sellerProducts);
  };

  return (
    <div className="your-products">
      <div className="filters">
        <h2>Sort By</h2>
        <ul className="sort_by_buttons">
          <li><button className={`${sortBy === 'rating-low' ? 'active' : ''}`} onClick={() => handleSortChange('rating-low')}>Lowest Rating</button></li>
          <li><button className={`${sortBy === 'rating-high' ? 'active' : ''}`} onClick={() => handleSortChange('rating-high')}>Highest Rating</button></li>
          <li><button className={`${sortBy === 'price-high' ? 'active' : ''}`} onClick={() => handleSortChange('price-high')}>Price High to Low</button></li>
          <li><button className={`${sortBy === 'price-low' ? 'active' : ''}`} onClick={() => handleSortChange('price-low')}>Price Low to High</button></li>
          <li><button className={`${sortBy === 'reviews-high' ? 'active' : ''}`} onClick={() => handleSortChange('reviews-high')}>Most Reviews</button></li>
        </ul>
      </div>

      <div className="product-list">
        <h2 className="your_products_title">Your Products</h2>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <SellerProduct key={product.id} id={product.id} onUpdate={handleUpdate} />
          ))
        ) : (
          <p>There are no products.</p>
        )}
      </div>
    </div>
  );
};

export default YourProducts;
