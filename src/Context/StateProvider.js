// StateProvider.js
import React, { createContext, useContext, useReducer } from 'react';
import reducer, { initialState } from '../reducer'; // Update import

export const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={[state, dispatch]}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateValue = () => useContext(StateContext);
