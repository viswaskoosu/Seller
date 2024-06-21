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
    let fromDate;

    switch (filter) {
      case 'all':
        return sellingHistory.slice().sort((a, b) => {
          const lastSoldDateA = a.transactions[0].soldDate;
          const lastSoldDateB = b.transactions[0].soldDate;
          return lastSoldDateB - lastSoldDateA;
        });

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
        if (!customYear) return sellingHistory;
        fromDate = new Date(customYear, 0, 1);
        const toDate = new Date(customYear, 11, 31, 23, 59, 59);
        return sellingHistory.filter(product => {
          const lastTransactionDate = product.transactions[0].soldDate;
          return lastTransactionDate >= fromDate && lastTransactionDate <= toDate;
        }).sort((a, b) => {
          const lastSoldDateA = a.transactions[0].soldDate;
          const lastSoldDateB = b.transactions[0].soldDate;
          return lastSoldDateB - lastSoldDateA;
        });

      default:
        return sellingHistory;
    }

    return sellingHistory.filter(product => {
      const lastTransactionDate = product.transactions[0].soldDate;
      return lastTransactionDate >= fromDate;
    }).sort((a, b) => {
      const lastSoldDateA = a.transactions[0].soldDate;
      const lastSoldDateB = b.transactions[0].soldDate;
      return lastSoldDateB - lastSoldDateA;
    });
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

  const renderTransactions = (product) => {
    if (!product.transactions || product.transactions.length === 0) {
      return (
        <tr key={product.product.id}>
          <td colSpan="9">No transactions available</td>
        </tr>
      );
    }

    return product.transactions.map((transaction, index) => (
      <tr key={transaction.transactionId}>
        {index === 0 ? (
          <>
            <td rowSpan={product.transactions.length}>
              <Link to={`/product/${product.product.id}`}>{product.product.title}</Link>
            </td>
            <td rowSpan={product.transactions.length}>
              {product.product.price ? `₹${product.product.price.toFixed(2)}` : 'Price N/A'}
            </td>
          </>
        ) : null}
        <td>{transaction.quantity}</td>
        <td>{transaction.amount.toFixed(2)}</td>
        <td>{transaction.buyer.name}</td>
        <td>{transaction.transactionId}</td>
        <td>{formatDate(transaction.soldDate)}</td>
        <td>{transaction.paymentMethod}</td>
        <td>{renderOrderStatus(transaction.orderStatus)}</td>
      </tr>
    ));
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
          {filteredHistory.length > 0 ? (
            filteredHistory.map((product) => renderTransactions(product))
          ) : (
            <tr>
              <td colSpan="9">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SellingHistory;
