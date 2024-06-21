import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import ProductDetail from "./Pages/ProductDetail";
import ErrorPage from "./Pages/Error";
import SellerDashboard from "./Pages/SellerDashboard";
import YourProducts from "./Pages/YourProducts";
import SellingHistory from "./Pages/SellingHistory";
import { useStateValue } from "./Context/StateProvider";
import axios from "axios";
import LoadingPage from "./Pages/LoadingPage";
import Header from "./components/Header";
import SellerAccountPage from "./Pages/SellerAccountPage";
import AddProduct from "./Pages/AddProduct";
import SignUp from "./Pages/SignUp";
import Addresses from "./Pages/SellerAddresses";
import ProductDetailInfo from "./Pages/ProductDetailInfo";
import SignIn from "./Pages/SignIn";
import {ToastContainer} from 'react-toastify'
import Statistics from "./Pages/Statistics";
import {getReq} from './Requests'
function App() {
  const [{ user }, dispatch] = useStateValue();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (window.location.pathname === "/error" || window.location.pathname==='/signup' || window.location.pathname==='/signin') {
      setIsLoading(false);
      return;
    }
    // console.log(user);
    if (!user?.token) {
      if (window.location.path !== "/signin") {
        setIsLoading(false);
        window.location.replace("/signin");
      }
      return;
    }
    // setIsLoading(true);
    // axios
    //   .get(
    //     `${process.env.REACT_APP_API_URL}/product/fetchproducts?seller=${user.token}`
    //   )
    //   .then((response) => {
    //     dispatch({
    //       type: "SET_PRODUCTS",
    //       products: response.data,
    //     });
    //   })
    //   .catch(() => {
    //     setIsLoading(false);
    //     window.location.replace("/error");
    //   })
    //   .finally(() => {
    //     setIsLoading(false);
    //   });
    getReq(setIsLoading, `/product/fetchproducts`)
    .then((products) => {
      dispatch({
              type: "SET_PRODUCTS",
              products: products,
            });
    })
    .catch(() => {
      setIsLoading(false);
      window.location.replace("/error");
    })
    .finally(() => {
      setIsLoading(false);
    })
  }, [dispatch]);

  return isLoading ? (
    <LoadingPage />
  ) : (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route
          path="/product-preview/:productId"
          element={<ProductDetailInfo />}
        />
        <Route path="/seller-dashboard" element={<SellerDashboard />} />
        <Route path="/seller-statistics" element={<Statistics />} />
        <Route path="/your-products" element={<YourProducts />} />
        <Route path="/selling-history" element={<SellingHistory />} />
        <Route path="/account" element={<SellerAccountPage />} />
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/signup" element={<SignUp />} />
        {/* <Route path="/seller-addresses" element={<Addresses />} /> */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <ToastContainer/>

    </Router>
  );
}

export default App;
