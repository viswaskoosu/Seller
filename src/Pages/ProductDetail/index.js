// src/Pages/ProductDetail.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useStateValue } from '../../Context/StateProvider';
import { actionTypes } from '../../reducer';
import './ProductDetail.css'; // Import CSS file
import Carousel from '../../components/Carousel'; // Import Carousel component

const ProductDetail = () => {
  const { productId } = useParams();
  const [{ products }, dispatch] = useStateValue();
  const product = products.find((prod) => prod.id === productId);

  const [isEditing, setIsEditing] = useState(false);
  const [updatedProduct, setUpdatedProduct] = useState({});

  useEffect(() => {
    if (product) {
      // Convert specifications object to an array of key-value pairs
      const specificationsArray = Object.entries(product.specifications).map(([key, value]) => ({
        key,
        value,
      }));
      setUpdatedProduct({ ...product, specifications: specificationsArray });
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

  const handleSpecificationChange = (index, key, value) => {
    const newSpecifications = [...updatedProduct.specifications];
    newSpecifications[index] = { key, value };
    setUpdatedProduct((prev) => ({
      ...prev,
      specifications: newSpecifications,
    }));
  };

  const handleSave = () => {
    // Convert specifications array back to an object
    const specificationsObject = updatedProduct.specifications.reduce((acc, { key, value }) => {
      acc[key] = value;
      return acc;
    }, {});

    dispatch({
      type: actionTypes.UPDATE_PRODUCT,
      product: { ...updatedProduct, specifications: specificationsObject },
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Convert specifications object to an array of key-value pairs
    const specificationsArray = Object.entries(product.specifications).map(([key, value]) => ({
      key,
      value,
    }));
    setUpdatedProduct({ ...product, specifications: specificationsArray });
    setIsEditing(false);
  };

  return (
    <div className='product-detail'>
      <div className='product-detail-header'>
        <h2>Product Detail</h2>
        {!isEditing && (
          <button className='edit-button' onClick={() => setIsEditing(true)}>
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div className='edit-form'>
          <div className='form-group'>
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={updatedProduct.title}
              onChange={handleInputChange}
            />
          </div>
          <div className='form-group'>
            <label>Price:</label>
            <input
              type="number"
              name="price"
              value={updatedProduct.price}
              onChange={handleInputChange}
            />
          </div>
          <div className='form-group'>
            <label>MRP:</label>
            <input
              type="number"
              name="mrp"
              value={updatedProduct.mrp}
              onChange={handleInputChange}
            />
          </div>
          <div className='form-group'>
            <label>Category:</label>
            <input
              type="text"
              name="category"
              value={updatedProduct.category}
              onChange={handleInputChange}
            />
          </div>
          <div className='form-group'>
            <label>Description:</label>
            <textarea
              name="description"
              value={updatedProduct.description}
              onChange={handleInputChange}
              className='resize-textarea'
              rows={Math.max(updatedProduct.description.split('\n').length, 1)}
              style={{ resize: 'vertical' }}
            />
          </div>
          <div className='form-group'>
            <label>Available:</label>
            <input
              type="number"
              name="available"
              value={updatedProduct.available}
              onChange={handleInputChange}
            />
          </div>
          <div className='form-group'>
            <label>Tags:</label>
            <textarea
              name="tags"
              value={updatedProduct.tags.join('\n')}
              onChange={(e) =>
                handleInputChange({
                  target: {
                    name: 'tags',
                    value: e.target.value.split('\n'),
                  },
                })
              }
              rows={Math.max(updatedProduct.tags.length, 1)}
              style={{ resize: 'vertical' }}
              className='resize-textarea'
            />
          </div>
          <div className='form-group'>
            <label>Key Features:</label>
            <textarea
              name="keyFeatures"
              value={updatedProduct.keyFeatures.join('\n')}
              onChange={(e) =>
                handleInputChange({
                  target: {
                    name: 'keyFeatures',
                    value: e.target.value.split('\n'),
                  },
                })
              }
              rows={Math.max(updatedProduct.keyFeatures.length, 1)}
              style={{ resize: 'vertical' }}
              className='resize-textarea'
            />
          </div>
          <div className='form-group'>
            <label>Specifications:</label>
            <div className='specifications'>
              {updatedProduct.specifications.map((spec, index) => (
                <div key={index} className='specification'>
                  <input
                    type="text"
                    value={spec.key}
                    onChange={(e) =>
                      handleSpecificationChange(index, e.target.value, spec.value)
                    }
                    className='spec-input'
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) =>
                      handleSpecificationChange(index, spec.key, e.target.value)
                    }
                    className='spec-input'
                  />
                </div>
              ))}
            </div>
          </div>
          <div className='form-group'>
            <label>Images:</label>
            <textarea
              name="images"
              value={updatedProduct.images.join('\n')}
              onChange={(e) =>
                handleInputChange({
                  target: {
                    name: 'images',
                    value: e.target.value.split('\n'),
                  },
                })
              }
              rows={Math.max(updatedProduct.images.length, 1)}
              style={{ resize: 'vertical' }}
              className='resize-textarea'
            />
          </div>
          <button className='save-button' onClick={handleSave}>Save</button>
          <button className='cancel-button' onClick={handleCancel}>Cancel</button>
        </div>
      ) : (
        <div className='product-info'>
          <Carousel images={product.images} />
          <div className='info-group'>
            <p><strong>Title:</strong> {product.title}</p>
            <p><strong>Price:</strong> ₹{product.price}</p>
            <p><strong>MRP:</strong> ₹{product.mrp}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Description:</strong> {product.description}</p>
            <p><strong>Available:</strong> {product.available}</p>
            <p><strong>Tags:</strong></p>
            <ul>
              {product.tags.map((tag, index) => (
                <li key={index}>{tag}</li>
              ))}
            </ul>
            <p><strong>Key Features:</strong></p>
            <ul>
              {product.keyFeatures.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <p><strong>Specifications:</strong></p>
            <ul>
              {Object.entries(product.specifications).map(([key, value], index) => (
                <li key={index}><strong>{key}:</strong> {value}</li>
              ))}
            </ul>
            <p><strong>Reviews:</strong> {product.reviews.length}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;