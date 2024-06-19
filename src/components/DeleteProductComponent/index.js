import React from 'react';
import { useStateValue, actionTypes } from '../../Context/StateProvider';

const DeleteProductComponent = ({ productId }) => {
  const [{ products }, dispatch] = useStateValue();

  const deleteProduct = () => {
    dispatch({
      type: actionTypes.DELETE_PRODUCT,
      productId: productId,
    });
  };

  return (
    <button onClick={deleteProduct}>Delete Product</button>
  );
};

export default DeleteProductComponent;
