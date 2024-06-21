import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SellingHistory.css';
import dummySellingHistory from '../../dummySellingHistory';

function SellingHistory() {
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
    const currentDate = new Date();
    let fromDate;

    switch (filter) {
      case 'all':
        return sellingHistory.flatMap(item =>
          item.soldDate.map(date => ({
            ...item,
            soldDate: date
          }))
        ).sort((a, b) => b.soldDate - a.soldDate);

      case '3months':
        fromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, currentDate.getDate());
        break;
      case '6months':
        fromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, currentDate.getDate());
        break;
      case '1year':
        fromDate = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate());
        break;
      case '2years':
        fromDate = new Date(currentDate.getFullYear() - 2, currentDate.getMonth(), currentDate.getDate());
        break;
      case '5years':
        fromDate = new Date(currentDate.getFullYear() - 5, currentDate.getMonth(), currentDate.getDate());
        break;
      case 'custom':
        if (!customYear) return sellingHistory;
        fromDate = new Date(customYear, 0, 1);
        const toDate = new Date(customYear, 11, 31, 23, 59, 59);
        return sellingHistory
          .flatMap(item =>
            item.soldDate.map(date => ({
              ...item,
              soldDate: date
            }))
          )
          .filter(item => item.soldDate >= fromDate.getTime() && item.soldDate <= toDate.getTime())
          .sort((a, b) => b.soldDate - a.soldDate);

      default:
        return sellingHistory;
    }

    return sellingHistory
      .flatMap(item =>
        item.soldDate.map(date => ({
          ...item,
          soldDate: date
        }))
      )
      .filter(item => item.soldDate >= fromDate.getTime())
      .sort((a, b) => b.soldDate - a.soldDate);
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
    if(status===1) return 'Delivered';
    else if(status === 0 ) return 'Shipped';
    else if(status === -1) return 'Have to Ship'
  };

  return (
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
            <th>Price</th>
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
          {filteredHistory.map((item, index) => (
            <tr key={index}>
              <td>
                <Link to={`/product/${item.product.id}`}>{item.product.title}</Link>
              </td>
              <td>₹{item.price.toFixed(2)}</td>
              <td>{item.quantitySold}</td>
              <td>₹{(item.price * item.quantitySold).toFixed(2)}</td>
              <td>{item.buyer.name}</td>
              <td>{item.transactionId}</td>
              <td>{formatDate(item.soldDate)}</td>
              <td>{item.paymentMethod}</td>
              <td>{renderOrderStatus(item.orderStatus)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SellingHistory;
