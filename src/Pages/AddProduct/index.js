import React, { useState } from "react";
import { useStateValue } from "../../Context/StateProvider";
import { actionTypes } from "../../reducer";
import {useNavigate} from 'react-router-dom'
const AddProduct = () => {
  const [, dispatch] = useStateValue();
  const navigate = useNavigate();
  const [newProduct, setNewProduct] = useState({});
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    dispatch({
      type: actionTypes.ADD_PRODUCT,
      product: {...newProduct, dateAdded: new Date(Date.now()).toISOString()},
    });
    navigate('/your-products')
  };

  const handleCancel = () => {
    // setnewProduct({ ...product });
  };
  return (
    <div>
      <div>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={newProduct.title}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Price:</label>
        <input
          type="number"
          name="price"
          value={newProduct.price}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>MRP:</label>
        <input
          type="number"
          name="mrp"
          value={newProduct.mrp}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Category:</label>
        <input
          type="text"
          name="category"
          value={newProduct.category}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          name="description"
          value={newProduct.description}
          onChange={handleInputChange}
        ></textarea>
      </div>
      <div>
        <label>Available:</label>
        <input
          type="number"
          name="available"
          value={newProduct.available}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Rating:</label>
        <input
          type="number"
          name="rating"
          value={newProduct.rating}
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
          value={newProduct.tags?.join(", ")}
          onChange={(e) =>
            handleInputChange({
              target: {
                name: "tags",
                value: e.target.value.split(", "),
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
          value={newProduct.keyFeatures?.join(", ")}
          onChange={(e) =>
            handleInputChange({
              target: {
                name: "keyFeatures",
                value: e.target.value.split(", "),
              },
            })
          }
        />
      </div>
      <div>
        <label>Specifications:</label>
        <textarea
          name="specifications"
          value={JSON.stringify(newProduct.specifications, null, 2)}
          onChange={(e) =>
            handleInputChange({
              target: {
                name: "specifications",
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
          value={newProduct.images?.join(", ")}
          onChange={(e) =>
            handleInputChange({
              target: {
                name: "images",
                value: e.target.value.split(", "),
              },
            })
          }
        />
      </div>
      <button onClick={handleSave}>Save</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
};

export default AddProduct;
