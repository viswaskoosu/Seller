import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./SellingHistory.css";
import dummySellingHistory from "../../dummySellingHistory";
import Header from "../../components/Header";
import { useStateValue } from "../../Context/StateProvider";
import { useNavigate } from "react-router-dom";
import { getReq, displayError, postReq } from "../../Requests";
import LoadingPage from '../LoadingPage'
import 'react-toastify/dist/ReactToastify.css'
import {toast} from 'react-toastify'
function SellingHistory() {
  const [{ userLoggedIn }] = useStateValue();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!userLoggedIn) {
      navigate("/signin");
      return;
    }
    getReq(setIsLoading, "/seller/fetchhistory")
      .then((responseData) => {
        setSellingHistory(responseData);
        console.log(responseData);
      })
      .catch((e) => {
        displayError(e);
      });
  }, [userLoggedIn]);
  // const [sellingHistory, setSellingHistory] = useState(dummySellingHistory);
  const [sellingHistory, setSellingHistory] = useState([]);
  // console.log(sellingHistory)

  const [filteredHistory, setFilteredHistory] = useState([]);
  const [filter, setFilter] = useState("all");
  const [customYear, setCustomYear] = useState("");
  const currentDate = new Date();

  const handleFilterChange = (event) => {
    const value = event.target.value;
    setFilter(value);
    if (value !== "custom") {
      setCustomYear("");
    }
  };

  const handleCustomYearChange = (event) => {
    const value = event.target.value;
    setCustomYear(value);
    setFilter("custom");
  };

  const filterAndSortHistory = (newHistory) => {
    let fromDate;
    let toDate;

    switch (filter) {
      case "all":
       return newHistory.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());

      case "3months":
        fromDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - 3,
          1
        );
        break;
      case "6months":
        fromDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - 6,
          1
        );
        break;
      case "1year":
        fromDate = new Date(
          currentDate.getFullYear() - 1,
          currentDate.getMonth(),
          1
        );
        break;
      case "2years":
        fromDate = new Date(
          currentDate.getFullYear() - 2,
          currentDate.getMonth(),
          1
        );
        break;
      case "5years":
        fromDate = new Date(
          currentDate.getFullYear() - 5,
          currentDate.getMonth(),
          1
        );
        break;
      case "custom":
        if (!customYear)
          // return sellingHistory.flatMap(product => product.transactions).sort((a, b) => b.soldDate - a.soldDate);
          return newHistory.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());

        fromDate = new Date(customYear, 0, 1);
        toDate = new Date(customYear, 11, 31, 23, 59, 59);
        return newHistory
          .filter(
            (history) =>
            new Date(history.orderDate).getTime() >= fromDate.getTime() &&
            new Date(history.orderDate).getTime() <= toDate.getTime()
          )
          .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());

      default:
        return newHistory.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
    }
    // sellingHistory
    //   .forEach((history) => console.log(new Date(history.orderDate).getTime()))
    return newHistory
      .filter((history) => new Date(history.orderDate).getTime() >= fromDate.getTime())
      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  };

  useEffect(() => {
    const filteredData = filterAndSortHistory(sellingHistory);
    setFilteredHistory(filteredData);
  }, [filter, customYear, sellingHistory]);

  const formatDate = (timestamp) => {
    const dateObject = new Date(timestamp);
    return isNaN(dateObject.getTime())
      ? "Invalid Date"
      : dateObject.toLocaleDateString("en-US");
  };

  const renderOrderStatus = (status) => {
    switch (status) {
      case 1:
        return "Delivered";
      case 0:
        return "Shipped";
      case -1:
        return "Not yet shipped";
      default:
        return "Unknown";
    }
  };
  const trimTitle = (title, maxLength) => {
    if (title.length <= maxLength) {
      return title;
    }
    return title.substring(0, maxLength) + "...";
  };
  const handleShip = (historyId) => {
    console.log(historyId)
    postReq(setIsLoading, '/seller/ordershipment', {history: historyId})
    .then(() => {
      const index = sellingHistory.findIndex(hist => hist._id === historyId)
      const newHistory = [...sellingHistory]
      newHistory[index].orderStatus = 0
      setSellingHistory(newHistory)
      // const filteredData = filterAndSortHistory(newHistory);
      // setFilteredHistory(filteredData);
      toast.success("Order shipped")
    })
    .catch((e) => {
      displayError(e)
    })

  }
  return !userLoggedIn ? (
    <></>
  ) : (isLoading? <LoadingPage/>:
    <div className="selling">
      {/* <Header /> */}
      <div className="selling-history-container">
        <h1 className="selling-history-title">Selling History</h1>
        <div className="selling-history-filter">
  <label htmlFor="filter">Filter by:</label>
  <select id="filter" value={filter} onChange={handleFilterChange}>
    <option value="all">All</option>
    <option value="3months">Last 3 months</option>
    <option value="6months">Last 6 months</option>
    <option value="1year">Last 1 year</option>
    <option value="2years">Last 2 years</option>
    <option value="5years">Last 5 years</option>
    <option value="custom">Custom Year</option>
  </select>
  {filter === "custom" && (
    <select
      id="customYear"
      value={customYear}
      onChange={handleCustomYearChange}
    >
      <option value="">Select Year</option>
      {Array.from(
        { length: 10 },
        (v, i) => currentDate.getFullYear() - i
      ).map((year, index) => (
        <option key={index} value={year}>
          {year}
        </option>
      ))}
    </select>
  )}
</div>
        <table className="selling-history-table">
          <thead>
            <tr>
              <th>Buyer</th>
              <th>Transaction ID</th>
              <th>Date</th>
              <th>Payment Method</th>
              <th>Title</th>
              <th>Amount</th>
              <th>Quantity Sold</th>
              <th>Order Status</th> {/* Button beside Order Status */}
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length > 0 ? (
              filteredHistory.map((history, historyIndex) =>
                history.products.map((product, productIndex) => (
                  <tr
                    key={`${product.product}-${history.order}-${productIndex}`}
                  >
                    {/* Render common fields only on the first product row */}
                    {productIndex === 0 && (
                      <>
                        <td
                          data-label="Buyer"
                          className="shipping-address-cell"
                          rowSpan={history.products.length}
                        >
                          <div className="shipping-address">
                            <p>{history.shippingAddress.recipient}</p>
                            <p>
                              {history.shippingAddress.street},{" "}
                              {history.shippingAddress.city}
                            </p>
                            <p>
                              {history.shippingAddress.state},{" "}
                              {history.shippingAddress.zip}
                            </p>
                            <p>{history.shippingAddress.country}</p>
                          </div>
                        </td>
                        <td
                          data-label="Transaction ID"
                          rowSpan={history.products.length}
                        >
                          {history.transactionID}
                        </td>
                        <td data-label="Date" rowSpan={history.products.length}>
                          {formatDate(history.orderDate)}
                        </td>
                        <td
                          data-label="Payment Method"
                          rowSpan={history.products.length}
                        >
                          {history.paymentMethod}
                        </td>
                      </>
                    )}
                    {/* Product-specific fields */}
                    <td data-label="Title">
                      <Link to={`/product/${product.product}`}>
                        {trimTitle(product.productTitle, 35)}
                      </Link>
                    </td>
                    <td data-label="Amount">{`₹${product.price*product.quantity}`}</td>
                    <td data-label="Quantity Sold">{product.quantity}</td>
                    {/* Render Order Status only on the first product row */}
                    {productIndex === 0 && (
                      <td
                        data-label="Order Status"
                        rowSpan={history.products.length}
                        className="order-status-cell"
                      >
                        {renderOrderStatus(history.orderStatus)}
                        {history.orderStatus === -1 ? (
                          <>
                            <br />
                            <button className="ship-button" onClick={() => handleShip(history._id)}>Ship</button>
                          </>
                        ) : (
                          <></>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )
            ) : (
              <tr>
                <td colSpan="8">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SellingHistory;
