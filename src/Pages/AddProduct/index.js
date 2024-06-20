import React, { useState } from "react";
import { useStateValue } from "../../Context/StateProvider";
import { actionTypes } from "../../reducer";
import { useNavigate } from 'react-router-dom';
import './AddProduct.css'; // Import CSS file for consistent styling

const AddProduct = () => {
  const [, dispatch] = useStateValue();
  const navigate = useNavigate();
  const [newProduct, setNewProduct] = useState({
    title: '',
    price: '',
    mrp: '',
    category: '',
    description: '',
    available: '',
    tags: [],
    keyFeatures: [],
    specifications: [],
    images: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSpecificationChange = (index, key, value) => {
    const newSpecifications = [...newProduct.specifications];
    newSpecifications[index] = { key, value };
    setNewProduct((prev) => ({
      ...prev,
      specifications: newSpecifications,
    }));
  };

  const handleAddSpecification = () => {
    setNewProduct((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }],
    }));
  };

  const handleSave = () => {
    // Convert specifications array to object
    const specificationsObject = newProduct.specifications.reduce((acc, { key, value }) => {
      acc[key] = value;
      return acc;
    }, {});

    dispatch({
      type: actionTypes.ADD_PRODUCT,
      product: { ...newProduct, specifications: specificationsObject, dateAdded: new Date().toISOString() },
    });
    navigate('/your-products');
  };

  const handleCancel = () => {
    navigate('/your-products');
  };

  return (
    <div className="product-detail">
      <div className="product-detail-header">
        <h2>Add Product</h2>
      </div>
      <div className="edit-form">
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={newProduct.title}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={newProduct.price}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>MRP:</label>
          <input
            type="number"
            name="mrp"
            value={newProduct.mrp}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Category:</label>
          <input
            type="text"
            name="category"
            value={newProduct.category}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={newProduct.description}
            onChange={handleInputChange}
            className="resize-textarea"
            rows={Math.max(newProduct.description.split('\n').length, 1)}
            style={{ resize: 'vertical' }}
          />
        </div>
        <div className="form-group">
          <label>Available:</label>
          <input
            type="number"
            name="available"
            value={newProduct.available}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Tags:</label>
          <textarea
            name="tags"
            value={newProduct.tags.join('\n')}
            onChange={(e) =>
              handleInputChange({
                target: {
                  name: 'tags',
                  value: e.target.value.split('\n'),
                },
              })
            }
            rows={Math.max(newProduct.tags.length, 1)}
            style={{ resize: 'vertical' }}
            className="resize-textarea"
          />
        </div>
        <div className="form-group">
          <label>Key Features:</label>
          <textarea
            name="keyFeatures"
            value={newProduct.keyFeatures.join('\n')}
            onChange={(e) =>
              handleInputChange({
                target: {
                  name: 'keyFeatures',
                  value: e.target.value.split('\n'),
                },
              })
            }
            rows={Math.max(newProduct.keyFeatures.length, 1)}
            style={{ resize: 'vertical' }}
            className="resize-textarea"
          />
        </div>
        <div className="form-group">
          <label>Specifications:</label>
          <div className="specifications">
            {newProduct.specifications.map((spec, index) => (
              <div key={index} className="specification">
                <input
                  type="text"
                  placeholder="Key"
                  value={spec.key}
                  onChange={(e) =>
                    handleSpecificationChange(index, e.target.value, spec.value)
                  }
                  className="spec-input"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={spec.value}
                  onChange={(e) =>
                    handleSpecificationChange(index, spec.key, e.target.value)
                  }
                  className="spec-input"
                />
              </div>
            ))}
            <button onClick={handleAddSpecification}>Add Specification</button>
          </div>
        </div>
        <div className="form-group">
          <label>Images:</label>
          <textarea
            name="images"
            value={newProduct.images.join('\n')}
            onChange={(e) =>
              handleInputChange({
                target: {
                  name: 'images',
                  value: e.target.value.split('\n'),
                },
              })
            }
            rows={Math.max(newProduct.images.length, 1)}
            style={{ resize: 'vertical' }}
            className="resize-textarea"
          />
        </div>
        <button className="save-button" onClick={handleSave}>Save</button>
        <button className="cancel-button" onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default AddProduct;
