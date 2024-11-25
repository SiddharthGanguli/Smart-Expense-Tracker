import React, { useState, useEffect } from 'react';
import TransactionForm from './components/TransactionForm';
import { database, ref, onValue, push, set } from './components/firebase';

const App = () => {
  const [transactions, setTransactions] = useState([]); // State to store transactions

  // Fetching data from Firebase Realtime Database
  useEffect(() => {
    const transactionsRef = ref(database, 'transactions'); // Create a reference to the transactions node

    const unsubscribe = onValue(transactionsRef, (snapshot) => {
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

    // Cleanup listener
    return () => unsubscribe();
  }, []);

  // Adding a new transaction to Firebase
  const addTransaction = (transaction) => {
    const transactionsRef = ref(database, 'transactions'); // Reference to the transactions node
    const newTransactionRef = push(transactionsRef); // Create a new unique reference for the transaction

    set(newTransactionRef, transaction) // Set the transaction data at the new reference
      .then(() => {
        console.log('Transaction added:', transaction);
      })
      .catch((error) => {
        console.error('Error adding transaction:', error);
      });
  };

  return (
    <div className="app-container">
      <div className="app-wrapper">
        <h1>Expense Tracker</h1>
        <TransactionForm addTransaction={addTransaction} />

        <h2>Recent Transactions</h2>
        <ul>
          {transactions.length > 0 ? (
            // Reverse the order of transactions before rendering
            [...transactions].reverse().map((txn) => (
              <li key={txn.id}>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold">${txn.amount}</span>
                    <span className="text-sm text-gray-500">{txn.category}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(txn.date).toLocaleDateString()}
                  </div>
                </div>
                {txn.notes && (
                  <p className="mt-2 text-sm text-gray-600">Notes: {txn.notes}</p>
                )}
                {txn.isRecurring && (
                  <span className="text-sm text-green-600 mt-2 inline-block">
                    Recurring
                  </span>
                )}
              </li>
            ))
          ) : (
            <li className="text-center text-gray-500">No transactions added yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default App;
