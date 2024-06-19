// src/Pages/ProductDetail.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useStateValue } from '../../Context/StateProvider';
import { actionTypes } from '../../reducer';

const ProductDetail = () => {
  const { productId } = useParams();
  const [{ products }, dispatch] = useStateValue();
  const product = products.find((prod) => prod.id === productId);

  const [isEditing, setIsEditing] = useState(false);
  const [updatedProduct, setUpdatedProduct] = useState({});

  useEffect(() => {
    if (product) {
      setUpdatedProduct({ ...product });
    }
  }, [product]);

  if (!product) {
    return <div>Product not found</div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    dispatch({
      type: actionTypes.UPDATE_PRODUCT,
      product: updatedProduct,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setUpdatedProduct({ ...product });
    setIsEditing(false);
  };

  return (
    <div>
      <h2>Product Detail</h2>
      {isEditing ? (
        <div>
          <div>
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={updatedProduct.title}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Price:</label>
            <input
              type="number"
              name="price"
              value={updatedProduct.price}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>MRP:</label>
            <input
              type="number"
              name="mrp"
              value={updatedProduct.mrp}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Category:</label>
            <input
              type="text"
              name="category"
              value={updatedProduct.category}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Description:</label>
            <textarea
              name="description"
              value={updatedProduct.description}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <div>
            <label>Available:</label>
            <input
              type="number"
              name="available"
              value={updatedProduct.available}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Rating:</label>
            <input
              type="number"
              name="rating"
              value={updatedProduct.rating}
              onChange={handleInputChange}
              step="0.1"
              max="5"
              min="0"
            />
          </div>
          <div>
            <label>Tags:</label>
            <input
              type="text"
              name="tags"
              value={updatedProduct.tags.join(', ')}
              onChange={(e) =>
                handleInputChange({
                  target: {
                    name: 'tags',
                    value: e.target.value.split(', '),
                  },
                })
              }
            />
          </div>
          <div>
            <label>Key Features:</label>
            <input
              type="text"
              name="keyFeatures"
              value={updatedProduct.keyFeatures.join(', ')}
              onChange={(e) =>
                handleInputChange({
                  target: {
                    name: 'keyFeatures',
                    value: e.target.value.split(', '),
                  },
                })
              }
            />
          </div>
          <div>
            <label>Specifications:</label>
            <textarea
              name="specifications"
              value={JSON.stringify(updatedProduct.specifications, null, 2)}
              onChange={(e) =>
                handleInputChange({
                  target: {
                    name: 'specifications',
                    value: JSON.parse(e.target.value),
                  },
                })
              }
            ></textarea>
          </div>
          <div>
            <label>Images:</label>
            <input
              type="text"
              name="images"
              value={updatedProduct.images.join(', ')}
              onChange={(e) =>
                handleInputChange({
                  target: {
                    name: 'images',
                    value: e.target.value.split(', '),
                  },
                })
              }
            />
          </div>
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      ) : (
        <div>
          <img src={product.images[0]} alt={product.title} />
          <p>Title: {product.title}</p>
          <p>Price: ₹{product.price}</p>
          <p>MRP: ₹{product.mrp}</p>
          <p>Category: {product.category}</p>
          <p>Description: {product.description}</p>
          <p>Available: {product.available}</p>
          <p>Rating: {product.rating}</p>
          <p>Seller: {product.seller}</p>
          <p>Date Added: {new Date(product.dateAdded).toLocaleDateString()}</p>
          <p>Tags: {product.tags.join(', ')}</p>
          <p>Key Features: {product.keyFeatures.join(', ')}</p>
          <p>Specifications: {JSON.stringify(product.specifications, null, 2)}</p>
          <p>Reviews: {product.reviews.length}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
