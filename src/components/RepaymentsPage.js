import React, { useState, useEffect } from "react";
import { database, ref, onValue } from "./firebase"; // Adjust the import path
import { useNavigate } from "react-router-dom";

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
    <div>
      <h1>All Repayments</h1>
      <button onClick={() => navigate("/")}>Back to Dashboard</button>
      <ul>
        {repayments.map((repayment) => (
          <li key={repayment.id}>
            <strong>{repayment.category}</strong>: ${repayment.amount} - Due in{" "}
            {Math.ceil(
              (new Date(repayment.date) - new Date()) / (1000 * 60 * 60 * 24)
            )}{" "}
            days
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RepaymentsPage;
