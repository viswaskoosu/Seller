import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SellingHistory.css';
import dummySellingHistory from '../../dummySellingHistory';

function SellingHistory() {
  const [sellingHistory, setSellingHistory] = useState(dummySellingHistory);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [filter, setFilter] = useState('all'); // Default filter option
  const [customYear, setCustomYear] = useState(''); // State to hold custom year selection
  const currentDate = new Date(); // Declare currentDate here

  const handleFilterChange = (event) => {
    const value = event.target.value;
    setFilter(value);

    // Reset custom year selection if a predefined filter is selected
    if (value !== 'custom') {
      setCustomYear('');
    }
  };

  const handleCustomYearChange = (event) => {
    const value = event.target.value;
    setCustomYear(value);

    // Update filter state to 'custom' when a custom year is selected
    setFilter('custom');
  };

  const filterAndSortHistory = () => {
    const currentDate = new Date(); // Declare currentDate here

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
        if (!customYear) return sellingHistory; // Return original list if custom year is not selected

        // Calculate fromDate based on custom year
        fromDate = new Date(customYear, 0, 1); // January 1st of the selected custom year
        const toDate = new Date(customYear, 11, 31, 23, 59, 59); // December 31st of the selected custom year

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
        return sellingHistory; // Return original list if filter is invalid
    }

    // Filter based on fromDate and sort by SoldDate in descending order
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
  }, [filter, customYear, sellingHistory]); // Update when filter, customYear, or sellingHistory changes

  const formatDate = (timestamp) => {
    const dateObject = new Date(timestamp);
    return isNaN(dateObject.getTime()) ? 'Invalid Date' : dateObject.toLocaleDateString('en-US');
  };

  const renderOrderStatus = (status) => {
    return status === 1 ? 'Delivered' : 'Shipped';
  };

  return (
    <div className="selling-history-container">
      <h1 className="selling-history-title">Selling History</h1>

      {/* Filter dropdown */}
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

        {/* Custom Year selection */}
        {filter === 'custom' && (
          <select id="customYear" value={customYear} onChange={handleCustomYearChange}>
            <option value="">Select Year</option>
            {Array.from({ length: 10 }, (v, i) => currentDate.getFullYear() - i).map((year, index) => (
              <option key={index} value={year}>{year}</option>
            ))}
          </select>
        )}
      </div>

      {/* Selling history table */}
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
