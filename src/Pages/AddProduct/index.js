import React, { useState } from "react";
import { useStateValue } from "../../Context/StateProvider";
import { actionTypes } from "../../reducer";
import { useNavigate } from 'react-router-dom';
import Categories from "../../Categories";
import './AddProduct.css'; // Import CSS file for consistent styling
import TagsInput from "./tagsInput";
import {postReq, displayError} from '../../Requests'
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingPage from "../LoadingPage";
import Loading from "react-loading";
const AddProduct = () => {
  const [, dispatch] = useStateValue();
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();
  const [newProduct, setNewProduct] = useState({
    title: '',
    price: '',
    mrp: '',
    category: '',
    customCategory: '',
    description: '',
    available: '',
    tags: [],
    keyFeatures: [],
    specifications: [],
    images: [],
  });
  console.log(newProduct)
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

  const handleDeleteSpecification = (index) => {
    setNewProduct((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    // Convert specifications array to object
    const specificationsObject = newProduct.specifications.reduce((acc, { key, value }) => {
      acc[key] = value;
      return acc;
    }, {})

    const category = newProduct.category === 'Other' ? newProduct.customCategory : newProduct.category;
    console.log( { ...newProduct, category, specifications: specificationsObject, dateAdded: new Date().toISOString() })
    const modifiedProduct = { ...newProduct, price: Number(newProduct.price), mrp: Number(newProduct.mrp), available: Number(newProduct.available), category, specifications: specificationsObject, dateAdded: new Date().toISOString() }
    postReq(setIsLoading, '/product/editproduct?request=ADD', modifiedProduct)
    .then(() => {
      dispatch({
        type: actionTypes.ADD_PRODUCT,
        product: modifiedProduct ,
      });
    navigate('/your-products');
    })
    .catch((e) => {
      displayError(e)
    })
      
  };

  const handleCancel = () => {
    navigate('/your-products');
  };
  const [tags, setTags] = useState([]);
  const [keyFeatures, setKeyFeatures] = useState([]);
  const [images, setImages] = useState([]);
  return (isLoading? <LoadingPage/>:
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
          <select
            name="category"
            value={newProduct.category}
            onChange={handleInputChange}
          >
            <option value="">Select a category</option>
            {Categories.map((cat, index) => (
              <option key={index} value={cat.name}>
                {cat.name}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>
          {newProduct.category === 'Other' && (
            <input
              type="text"
              name="customCategory"
              value={newProduct.customCategory}
              onChange={handleInputChange}
              placeholder="Enter custom category"
            />
          )}
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
        {/* <div className="form-group">
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
        </div> */}
        <TagsInput newTag={tags} setNewTag={setTags} handleInputChange={handleInputChange} name='tags' displayName='Tags' />
        <TagsInput newTag={keyFeatures} setNewTag={setKeyFeatures} handleInputChange={handleInputChange} name='keyFeatures' displayName='Key Features' />
        {/* <div className="form-group">
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
        </div> */}
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
                <button onClick={() => handleDeleteSpecification(index)} className="delete-spec-button">Delete</button>
              </div>
            ))}
            <button onClick={handleAddSpecification}>Add Specification</button>
          </div>
        </div>
        {/* <div className="form-group">
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
        </div> */}
        <TagsInput newTag={images} setNewTag={setImages} handleInputChange={handleInputChange} name='images' displayName='Images' />
        <button className="save-button" onClick={handleSave}>Save</button>
        <button className="cancel-button" onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default AddProduct;
