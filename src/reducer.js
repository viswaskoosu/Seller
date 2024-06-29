export const initialState = {
  user: {displayName: 'nithin'},
  products: [],
  sellingHistory: [],
  userLoggedIn: false
  // sellingHistory:[],
};

export const actionTypes = {
  SET_USER: 'SET_USER',
  ADD_PRODUCT: 'ADD_PRODUCT',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  ADD_TO_SELLING_HISTORY: 'ADD_TO_SELLING_HISTORY',
  SET_PRODUCTS: 'SET_PRODUCTS',
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT',
  EDIT_ADDRESS: 'EDIT_ADDRESS',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
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
    case actionTypes.USER_LOGIN:
      return {
        ...state,
        userLoggedIn: true,
      }
    case actionTypes.USER_LOGOUT:
      return {
        ...state,
        user: {},
  products: [],
  sellingHistory: [],
  userLoggedIn: false
      }
    case actionTypes.EDIT_ADDRESS:
      // localStorage.setItem(
      //   "user",
      //   JSON.stringify({
      //     ...state.user,
      //     addresses: [action.address],
      //   })
      // );
      return {
        ...state,
        user: {
          ...state.user,
          addresses: [action.address],
        },
      };
    case actionTypes.UPDATE_PRODUCT: {
      const newProducts = state.products.filter((product) => product.id!==action.product.id)
      newProducts.push(action.product)
      return {
        ...state,
        products: newProducts,
      }
    }
    default:
      return state;
  }
};

export default reducer;