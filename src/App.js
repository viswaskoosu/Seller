import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import ProductDetail from './Pages/ProductDetail';
import ErrorPage from './Pages/Error'; 
import SellerDashboard from './Pages/SellerDashboard';
import YourProducts from './Pages/YourProducts';
import SellingHistory from './Pages/SellingHistory';
import { useStateValue } from './Context/StateProvider';
import axios from 'axios';
import LoadingPage from './Pages/LoadingPage';
import Header from './components/Header';
import SellerAccountPage from './Pages/SellerAccountPage';
<<<<<<< HEAD
import AddProduct from './Pages/AddProduct';
import SignUp from './Pages/SignUp';
=======
import Addresses from './Pages/SellerAddresses';
import ProductDetailInfo from './Pages/ProductDetailInfo';

>>>>>>> 4d2394d3aded169fc269614629f9e856686cb966
function App (){
  const [, dispatch] = useStateValue();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (window.location.pathname === '/error') return;
    setIsLoading(true);
    axios
    .get(`${process.env.REACT_APP_API_URL}/product/fetchproducts`)
    .then((response) => {
        dispatch({
          type: 'SET_PRODUCTS',
          products: response.data,
        });
      })
      .catch(() => {
        window.location.replace('/error');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [dispatch]);

  return isLoading ? (
    <LoadingPage />
  ) : (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/product-preview/:productId" element={<ProductDetailInfo />} />
        <Route path="/seller-dashboard" element={<SellerDashboard />} />
        <Route path="/your-products" element={<YourProducts />} />
        <Route path="/selling-history" element={<SellingHistory />} />
        <Route path="/account" element={<SellerAccountPage />} />
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path='/signup' element={<SignUp/>}/>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
