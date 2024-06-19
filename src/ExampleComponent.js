import React, { useContext, useState } from 'react';
import { StateContext, actionTypes } from './StateProvider';
import { Categories } from './categories'; // Assuming you have a Categories array defined somewhere

const ExampleComponent = () => {
  const { state, dispatch } = useContext(StateContext);
  const { products } = state;
  const [newProduct, setNewProduct] = useState({
    id: '',
    title: '',
    price: 0,
    category: Categories[0], // Default to the first category
    description: '',
    // Add more fields as needed for product creation
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const addProduct = () => {
    // Example of adding a product
    dispatch({
      type: actionTypes.ADD_PRODUCT,
      product: {
        ...newProduct,
        id: products.length + 1, // Example: Auto-incrementing ID (not ideal for real-world apps)
      },
    });
    // Clear form after adding product
    setNewProduct({
      id: '',
      title: '',
      price: 0,
      category: Categories[0],
      description: '',
    });
  };

  const deleteProduct = (productId) => {
    // Example of deleting a product
    dispatch({
      type: actionTypes.DELETE_PRODUCT,
      productId: productId,
    });
  };

  return (
    <div>
      <h2>Add or Manage Products</h2>
      <div>
        <label>
          Title:
          <input type="text" name="title" value={newProduct.title} onChange={handleInputChange} />
        </label>
        <label>
          Price:
          <input type="number" name="price" value={newProduct.price} onChange={handleInputChange} />
        </label>
        <label>
          Category:
          <select name="category" value={newProduct.category} onChange={handleInputChange}>
            {Categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </label>
        <label>
          Description:
          <textarea name="description" value={newProduct.description} onChange={handleInputChange} />
        </label>
        <button onClick={addProduct}>Add Product</button>
      </div>
      <div>
        <h3>My Products:</h3>
        <ul>
          {products.map(product => (
            <li key={product.id}>
              {product.title} - ${product.price}
              <button onClick={() => deleteProduct(product.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExampleComponent;
