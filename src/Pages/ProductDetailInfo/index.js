import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import { useStateValue } from '../../Context/StateProvider';
import './ProductDetailInfo.css';

const ProductDetailInfo = () => {
  const { productId } = useParams();
  const [{ products }] = useStateValue();
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchedProduct = products.find((product) => product.id === productId);
    if (fetchedProduct) {
      setProduct(fetchedProduct);
    }
    setIsLoading(false);
  }, [productId, products]);

  const handleImageClick = (index) => setCurrentImageIndex(index);

  const handlePrevImage = () =>
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : product.images.length - 1
    );

  const handleNextImage = () =>
    setCurrentImageIndex((prev) =>
      prev < product.images.length - 1 ? prev + 1 : 0
    );

  const sortReviewsByDate = () => {
    const sortedReviews = [...product.reviews].sort((a, b) =>
      new Date(b.date) - new Date(a.date)
    );
    setProduct({ ...product, reviews: sortedReviews });
  };

  const sortReviewsByHighestRated = () => {
    const sortedReviews = [...product.reviews].sort((a, b) => b.rating - a.rating);
    setProduct({ ...product, reviews: sortedReviews });
  };

  const sortReviewsByLowestRated = () => {
    const sortedReviews = [...product.reviews].sort((a, b) => a.rating - b.rating);
    setProduct({ ...product, reviews: sortedReviews });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="product_description">
      <div className="productDetail">
        <div className="imagePreviews">
          {product.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Preview ${index}`}
              className={`imagePreview ${index === currentImageIndex ? 'active' : ''}`}
              onClick={() => handleImageClick(index)}
            />
          ))}
        </div>
        <div className="productDetail_imageContainer">
          <button className="imageNavButton" onClick={handlePrevImage}>
            {'<'}
          </button>
          <img
            src={product.images[currentImageIndex]}
            alt={product.title}
            className="productDetail_image"
            onClick={() => setOpen(true)}
          />
          <button className="imageNavButton" onClick={handleNextImage}>
            {'>'}
          </button>
        </div>

        <div className="productDetail_info">
          <p className="productDetail_title">{product.title}</p>
          <p className="product_category">Category: {product.category}</p>
          <div className="rating">
            <Stack spacing={1}>
              <Rating
                name={`rating-${product.id}`}
                value={product.rating}
                precision={0.5}
                readOnly
              />
            </Stack>
            <p className="rating-text">
              ({product.reviews ? product.reviews.length : 0})
            </p>
          </div>
          <p className="productDetail_price">
            <strong>Price: </strong>
            <small>₹</small>
            <strong>{product.mrp}</strong>{' '}
            <strong
              style={{
                textDecoration: 'line-through',
                color: 'grey',
                fontWeight: 'normal',
                marginLeft: '10px',
                fontSize: '18px',
              }}
            >
              {product.price}
            </strong>
          </p>

          <div className="specifications">
            <p className="specifications_title">Specifications:</p>
            <ul>
              {Object.keys(product.specifications).map((key, index) => (
                <li key={index}>
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {product.specifications[key]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div>
        <p className="productDetail_description">{product.description}</p>
        <div className="keyFeatures">
          <p className="keyFeatures_title">Key Features:</p>
          <ul>
            {product.keyFeatures.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
        
      </div>
      <div className="reviews">
          <p className="reviews_title">Reviews:</p>
          <div className="review_sort">
            <button onClick={sortReviewsByDate}>Sort by Date</button>
            <button onClick={sortReviewsByHighestRated}>Sort by Highest Rated</button>
            <button onClick={sortReviewsByLowestRated}>Sort by Lowest Rated</button>
          </div>
          {product.reviews.map((review, index) => (
            <div key={index} className="review">
              <p>
                <strong>{review.reviewer}</strong>
              </p>
              <div className="rating">
                <Rating
                  name={`rating-${productId}-${index}`}
                  value={review.rating}
                  precision={0.5}
                  readOnly
                />
                <p>({review.rating})</p>
              </div>
              <p>{review.comment}</p>
              <p>Date: {review.date}</p>
            </div>
          ))}
        </div>
    </div>
  );
};

export default ProductDetailInfo;
