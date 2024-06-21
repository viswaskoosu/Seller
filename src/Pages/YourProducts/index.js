import React, { useState, useEffect } from 'react';
import SellerProduct from '../../components/SellerProduct';
import './YourProducts.css';
import { useStateValue } from '../../Context/StateProvider';
import {useNavigate} from 'react-router-dom'
const YourProducts = () => {
  const [{ products }, dispatch] = useStateValue();
  // console.log(products)
  const sellerId = '666b3653a34c6e81d0f94b0e';
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [sortBy, setSortBy] = useState('');
  const navigate = useNavigate()
  useEffect(() => {
    // const sellerProducts = products.filter(product => product.seller === sellerId);
    const sellerProducts = products
    setFilteredProducts(sellerProducts);
  }, [products]);
// console.log(sellerId)
// console.log(products)
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
    // const sellerProducts = products.filter(product => product.seller === sellerId);
    // setFilteredProducts(sellerProducts);
  };
  const handleAddProduct = () => {
    navigate('/addproduct')
  }
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
      <div className='add-new-product'>
        <h2 className="your_products_title">Your Products</h2>
        <button className='add-product-button' onClick={handleAddProduct}>Add Product</button>
      </div>
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
