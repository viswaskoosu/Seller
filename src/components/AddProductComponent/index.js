import React from 'react';
import { useStateValue, actionTypes } from '../../Context/StateProvider';

const AddProductComponent = ({ newProduct }) => {
  const [{}, dispatch] = useStateValue();

  const addProduct = () => {
    dispatch({
      type: actionTypes.ADD_PRODUCT,
      product: newProduct,
    });
  };

  return (
    <button onClick={addProduct}>Add Product</button>
  );
};

export default AddProductComponent;
