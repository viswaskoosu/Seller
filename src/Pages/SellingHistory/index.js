import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SellingHistory.css';
import dummySellingHistory from '../../dummySellingHistory';
import Header from '../../components/Header';
import { useStateValue } from '../../Context/StateProvider';
import {useNavigate} from 'react-router-dom'
function SellingHistory() {
  const [{userLoggedIn }] = useStateValue();

  const navigate = useNavigate()
  useEffect(() => {
    if (!userLoggedIn){
      navigate('/signin')
    }
  }, [userLoggedIn])
  
  const [sellingHistory, setSellingHistory] = useState(dummySellingHistory);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [filter, setFilter] = useState('all');
  const [customYear, setCustomYear] = useState('');
  const currentDate = new Date();

  const handleFilterChange = (event) => {
    const value = event.target.value;
    setFilter(value);
    if (value !== 'custom') {
      setCustomYear('');
    }
  };

  const handleCustomYearChange = (event) => {
    const value = event.target.value;
    setCustomYear(value);
    setFilter('custom');
  };

  const filterAndSortHistory = () => {
    let fromDate;
    let toDate;

    switch (filter) {
      case 'all':
        return sellingHistory.flatMap(product => product.transactions).sort((a, b) => b.soldDate - a.soldDate);

      case '3months':
        fromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1);
        break;
      case '6months':
        fromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, 1);
        break;
      case '1year':
        fromDate = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1);
        break;
      case '2years':
        fromDate = new Date(currentDate.getFullYear() - 2, currentDate.getMonth(), 1);
        break;
      case '5years':
        fromDate = new Date(currentDate.getFullYear() - 5, currentDate.getMonth(), 1);
        break;
      case 'custom':
        if (!customYear) return sellingHistory.flatMap(product => product.transactions).sort((a, b) => b.soldDate - a.soldDate);
        fromDate = new Date(customYear, 0, 1);
        toDate = new Date(customYear, 11, 31, 23, 59, 59);
        return sellingHistory.flatMap(product => product.transactions).filter(transaction => transaction.soldDate >= fromDate.getTime() && transaction.soldDate <= toDate.getTime()).sort((a, b) => b.soldDate - a.soldDate);

      default:
        return sellingHistory.flatMap(product => product.transactions).sort((a, b) => b.soldDate - a.soldDate);
    }

    return sellingHistory.flatMap(product => product.transactions).filter(transaction => transaction.soldDate >= fromDate.getTime()).sort((a, b) => b.soldDate - a.soldDate);
  };

  useEffect(() => {
    const filteredData = filterAndSortHistory();
    setFilteredHistory(filteredData);
  }, [filter, customYear, sellingHistory]);

  const formatDate = (timestamp) => {
    const dateObject = new Date(timestamp);
    return isNaN(dateObject.getTime()) ? 'Invalid Date' : dateObject.toLocaleDateString('en-US');
  };

  const renderOrderStatus = (status) => {
    switch (status) {
      case 1:
        return 'Delivered';
      case 0:
        return 'Shipped';
      case -1:
        return 'Not yet shipped';
      default:
        return 'Unknown';
    }
  };

  return (!userLoggedIn? <></>:
    <div className='selling'>
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
          {filter === 'custom' && (
            <select id="customYear" value={customYear} onChange={handleCustomYearChange}>
              <option value="">Select Year</option>
              {Array.from({ length: 10 }, (v, i) => currentDate.getFullYear() - i).map((year, index) => (
                <option key={index} value={year}>{year}</option>
              ))}
            </select>
          )}
        </div>
        <table className="selling-history-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Amount</th>
              <th>Quantity Sold</th>
              <th>Total Sale Amount</th>
              <th>Buyer</th>
              <th>Transaction ID</th>
              <th>Date</th>
              <th>Payment Method</th>
              <th>Order Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length > 0 ? (
              filteredHistory.map((transaction) => (
                <tr key={transaction.transactionId}>
                  <td data-label="Title">
                    <Link to={`/product/${transaction.productId}`}>{transaction.title}</Link>
                  </td>
                  <td data-label="Amount">{`₹${transaction.amount}`}</td>
                  <td data-label="Quantity Sold">{transaction.quantity}</td>
                  <td data-label="Total Sale Amount">{transaction.amount}</td>
                  <td data-label="Buyer">{transaction.buyer.name}</td>
                  <td data-label="Transaction ID">{transaction.transactionId}</td>
                  <td data-label="Date">{formatDate(transaction.soldDate)}</td>
                  <td data-label="Payment Method">{transaction.paymentMethod}</td>
                  <td data-label="Order Status">{renderOrderStatus(transaction.orderStatus)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SellingHistory;
