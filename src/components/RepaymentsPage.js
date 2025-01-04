import React, { useState, useEffect } from "react";
import { database, ref, onValue } from "./firebase"; // Adjust the import path
import { useNavigate } from "react-router-dom";
import "./RepaymentsPage.css"; // Import the CSS file for styling

const RepaymentsPage = () => {
  const [repayments, setRepayments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const transactionsRef = ref(database, "transactions");

    const unsubscribe = onValue(transactionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const fetchedTransactions = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        const filteredRepayments = fetchedTransactions.filter(
          (txn) => txn.isRecurring
        );
        setRepayments(filteredRepayments);
      } else {
        setRepayments([]);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="repayments-container">
      <h1>Upcoming Repayments</h1>
      <button className="back-to-dashboard-btn" onClick={() => navigate("/")}>
        Back to Dashboard
      </button>
      {repayments.length > 0 ? (
        <div className="repayments-list">
          {repayments.map((repayment) => (
            <div key={repayment.id} className="repayment-card">
              <div className="repayment-info">
                <strong>{repayment.category}</strong>: ₹{repayment.amount}
              </div>
              <div className="repayment-due">
                <span>Due in </span>
                <strong>
                  {Math.ceil(
                    (new Date(repayment.date) - new Date()) / (1000 * 60 * 60 * 24)
                  )}{" "}
                  days
                </strong>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No upcoming repayments found.</p>
      )}
    </div>
  );
};

export default RepaymentsPage;
