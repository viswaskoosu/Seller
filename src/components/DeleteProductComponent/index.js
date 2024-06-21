import React, {useState} from 'react';
import { useStateValue, actionTypes } from '../../Context/StateProvider';
import {postReq, displayError} from '../../Requests'
const DeleteProductComponent = ({ productId }) => {
  const [{ products }, dispatch] = useStateValue();
  const [isLoading, setIsLoading] = useState(false)
  const deleteProduct = () => {
    postReq(setIsLoading, `/product/editproduct?request=DELETE&id=${productId}`)
    .then(() => {
      dispatch({
        type: actionTypes.DELETE_PRODUCT,
        productId: productId,
      });
    })
    .catch((e) => {
      displayError(e)
    })
    
  };

  return (
    <button onClick={deleteProduct}>Delete Product</button>
  );
};

export default DeleteProductComponent;
