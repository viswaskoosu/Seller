export const initialState = {
  user: null,
  products: [],
  sellingHistory: [],
  sellingHistory:[],
};

export const actionTypes = {
  SET_USER: 'SET_USER',
  ADD_PRODUCT: 'ADD_PRODUCT',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  ADD_TO_SELLING_HISTORY: 'ADD_TO_SELLING_HISTORY',
  SET_PRODUCTS: 'SET_PRODUCTS',
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_PRODUCTS:
      return{
        ...state,
        products: action.products,
        
      }
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user,
      };
    case actionTypes.ADD_PRODUCT:
      return {
        ...state,
        products: [...state.products, action.product],
      };
    case actionTypes.DELETE_PRODUCT:
      const updatedProducts = state.products.filter(product => product.id !== action.productId);
      return {
        ...state,
        products: updatedProducts,
      };
    case actionTypes.ADD_TO_SELLING_HISTORY:
      return {
        ...state,
        sellingHistory: [...state.sellingHistory, action.sale],
      };
    default:
      return state;
  }
};

export default reducer;