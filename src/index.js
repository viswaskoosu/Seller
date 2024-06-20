// index.js or App.js (where you set up your root component)
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { StateProvider } from './Context/StateProvider';
import reducer from './reducer'
ReactDOM.render(
  <React.StrictMode>
  <StateProvider initialState={{ 
        user: null,
        products: [], 
        sellingHistory: [],
        userLoggedIn: false
    }} reducer={reducer}>
      <App />
      </StateProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
