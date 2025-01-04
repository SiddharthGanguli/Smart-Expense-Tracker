import React, { useState, useEffect } from 'react';
import { database, ref, onValue } from './firebase';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './ViewTransactions.css';

const ViewTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate(); // Create the navigate function

  useEffect(() => {
    const transactionsRef = ref(database, 'transactions');
    const unsubscribeTransactions = onValue(transactionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const fetchedTransactions = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setTransactions(fetchedTransactions);
      } else {
        setTransactions([]);
      }
    });

    return () => {
      unsubscribeTransactions();
    };
  }, []);

  const handleBackToDashboard = () => {
    navigate('/'); // Navigate back to the dashboard page (adjust if needed)
  };

  return (
    <div className="transaction-history-container">
      <h2 className="transaction-history-heading">Transaction History</h2>
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Category</th>
              <th>Date</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.id}>
                <td>₹{txn.amount}</td> {/* INR symbol */}
                <td>{txn.category}</td>
                <td>{new Date(txn.date).toLocaleDateString()}</td>
                <td>{txn.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Back to Dashboard Button */}
      <div className="back-to-dashboard-btn-container">
        <button className="back-to-dashboard-btn" onClick={handleBackToDashboard}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ViewTransactions;
