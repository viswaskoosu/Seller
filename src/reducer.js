export const initialState = {
  user: { displayName: 'nithin', addresses: [] },
  products: [],
  sellingHistory: [],
  userLoggedIn: false,
};

export const actionTypes = {
  SET_USER: 'SET_USER',
  ADD_PRODUCT: 'ADD_PRODUCT',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  ADD_TO_SELLING_HISTORY: 'ADD_TO_SELLING_HISTORY',
  SET_PRODUCTS: 'SET_PRODUCTS',
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT',
  ADD_ADDRESS: 'ADD_ADDRESS',
  EDIT_ADDRESS: 'EDIT_ADDRESS',
  DELETE_ADDRESS: 'DELETE_ADDRESS',
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_PRODUCTS:
      return {
        ...state,
        products: action.products,
      };
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
      const updatedProducts = state.products.filter(
        (product) => product.id !== action.productId
      );
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
      };
    case actionTypes.USER_LOGOUT:
      return {
        ...state,
        userLoggedIn: false,
      };
    case actionTypes.ADD_ADDRESS:
      return {
        ...state,
        user: {
          ...state.user,
          addresses: [...state.user.addresses, action.address],
        },
      };
    case actionTypes.EDIT_ADDRESS:
      return {
        ...state,
        user: {
          ...state.user,
          addresses: state.user.addresses.map((address) =>
            address.id === action.address.id ? action.address : address
          ),
        },
      };
    case actionTypes.DELETE_ADDRESS:
      return {
        ...state,
        user: {
          ...state.user,
          addresses: state.user.addresses.filter(
            (address) => address.id !== action.addressId
          ),
        },
      };
    default:
      return state;
  }
};

export default reducer;
