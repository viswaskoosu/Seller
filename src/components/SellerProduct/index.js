// src/components/SellerProduct/index.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SellerProduct.css';
import { Rating, Stack } from '@mui/material';
import { useStateValue } from '../../Context/StateProvider'; 
import { actionTypes } from '../../reducer'; 
import {postReq, displayError} from '../../Requests'

const SellerProduct = ({ id, onUpdate }) => {
  const [{ products }, dispatch] = useStateValue();
  const product = products.find(prod => prod.id === id);
  const [isLoading, setIsLoading] = useState(false)
  const [quantity, setQuantity] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (product) {
      setQuantity(product.available);
    }
  }, [product]);

  if (!product) {
    return <div>Product not found</div>;
  }

  const deleteProduct = () => {
    postReq(setIsLoading, `/product/editproduct?request=DELETE&id=${id}`)
    .then(() => {
      dispatch({
        type: actionTypes.DELETE_PRODUCT,
        productId: id,
      });
      setFeedback(`Product ${product.title} deleted successfully.`);
      if (onUpdate) onUpdate();
    })
    .catch((e) => {
      displayError(e)
    })
      
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    } else {
      deleteProduct();
    }
  };

  const saveChanges = () => {
    dispatch({
      type: actionTypes.UPDATE_PRODUCT_QUANTITY,
      productId: id,
      quantity: quantity,
    });
    setFeedback(`Quantity updated successfully to ${quantity}.`);
    if (onUpdate) onUpdate();
  };

  return (
    <div className='category-product'>
      <Link to={`/product/${id}`}>
        <img className='product-image' src={product.images[0]} alt={product.title} />
      </Link>
      <div className='product-info'>
        <Link to={`/product/${id}`}>
          <p className='product-title'>{product.title}</p>
        </Link>
        <p className='product-price'>
          <span className='price-symbol'>₹</span>
          <span className='price'>{product.price}</span>
          <br />
          <span className='mrp1'>M.R.P: </span>
          <span className='mrp2'>₹{product.mrp}</span>
        </p>
        <div className="rating">
          <Stack spacing={1}>
            <Rating name={`rating-${id}`} value={product.rating} precision={0.5} readOnly />
          </Stack>
          <p className="rating-text">({product.rating}) Rated by {product.reviews?.length} users</p>
        </div>
        <p>Current Quantity: {quantity}</p>
        <div>
          <button className="category-button" onClick={increaseQuantity}>
            Add more quantity 
          </button>
          <button className="category-button" onClick={decreaseQuantity}>
            Decrease quantity 
          </button>
          <button className="category-button" onClick={deleteProduct}>
            Delete Product
          </button>
          <button className="category-button" onClick={saveChanges}>
            Save Changes
          </button>
        </div>
        {feedback && <p className="feedback-message">{feedback}</p>}
      </div>
    </div>
  );
};

export default SellerProduct;
