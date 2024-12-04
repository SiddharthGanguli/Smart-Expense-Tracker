import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import { database, ref, onValue, push, set, remove } from './firebase';
import TransactionForm from './TransactionForm';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryTotals, setCategoryTotals] = useState({});
  const [monthlyTotals, setMonthlyTotals] = useState({});
  const [showHistory, setShowHistory] = useState(false);
  const navigate = useNavigate();

  // Add transaction to Firebase
  const addTransaction = (transaction) => {
    const transactionsRef = ref(database, 'transactions');
    const newTransactionRef = push(transactionsRef);

    set(newTransactionRef, transaction).catch((error) => {
      console.error('Error adding transaction:', error);
    });
  };

  // Add category to Firebase
  const addCategory = (newCategory) => {
    const categoriesRef = ref(database, 'categories');
    const newCategoryRef = push(categoriesRef);
    
    set(newCategoryRef, newCategory).catch((error) => {
      console.error('Error adding category:', error);
    });
  };

  // Delete category from Firebase
  const deleteCategory = (categoryToDelete) => {
    const categoriesRef = ref(database, 'categories');
  
    onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const categoryKey = Object.keys(data).find((key) => data[key] === categoryToDelete);
        if (categoryKey) {
          const categoryRefToDelete = ref(database, `categories/${categoryKey}`);
          set(categoryRefToDelete, null) // Setting to null deletes the node
            .then(() => {
              console.log(`Category "${categoryToDelete}" deleted successfully.`);
            })
            .catch((error) => {
              console.error('Error deleting category:', error);
            });
        } else {
          console.error(`Category "${categoryToDelete}" not found.`);
        }
      }
    }, { onlyOnce: true });
  };

  useEffect(() => {
    const transactionsRef = ref(database, 'transactions');
    const categoriesRef = ref(database, 'categories');

    const unsubscribeTransactions = onValue(transactionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const fetchedTransactions = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setTransactions(fetchedTransactions);
        calculateCategoryTotals(fetchedTransactions);
        calculateMonthlyTotals(fetchedTransactions);
      } else {
        setTransactions([]);
        setCategoryTotals({});
        setMonthlyTotals({});
      }
    });

    const unsubscribeCategories = onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val();
      setCategories(data ? Object.values(data) : []);
    });

    return () => {
      unsubscribeTransactions();
      unsubscribeCategories();
    };
  }, []);

  const calculateCategoryTotals = (transactions) => {
    const totals = {};
    transactions.forEach(({ category, amount }) => {
      if (!category || !amount) return;
      if (!totals[category]) totals[category] = 0;
      totals[category] += parseFloat(amount);
    });
    setCategoryTotals(totals);
  };

  const calculateMonthlyTotals = (transactions) => {
    const totals = {};
    transactions.forEach(({ date, amount }) => {
      if (!date || !amount) return;
      const transactionDate = new Date(date);
      const monthKey = `${transactionDate.getFullYear()}-${(transactionDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}`;
      if (!totals[monthKey]) totals[monthKey] = 0;
      totals[monthKey] += parseFloat(amount);
    });
    setMonthlyTotals(totals);
  };

  const handleShowMoreClick = () => navigate('/repayments');

  const categoryChartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      },
    ],
  };

  const monthlyChartData = {
    labels: Object.keys(monthlyTotals),
    datasets: [
      {
        label: 'Monthly Totals',
        data: Object.values(monthlyTotals),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      },
    ],
  };

  return (
    <div className="app-container">
      {!showHistory ? (
        <>
          <div className="left-side">
            <h1>Expense Tracker</h1>
            <TransactionForm 
              addTransaction={addTransaction} 
              categories={categories} 
              addCategory={addCategory} 
              deleteCategory={deleteCategory} 
            />
          </div>

          <div className="right-side">
            <div className="One">
              <Pie data={categoryChartData} />
            </div>
            <div className="Two">
              <Bar data={monthlyChartData} />
            </div>
            <div className="Three">
              <h2 className="investments-heading">Upcoming Investments</h2>
              {transactions.filter((txn) => txn.isRecurring).length > 0 ? (
                <>
                  <div className="investments-grid">
                    {transactions
                      .filter((txn) => txn.isRecurring)
                      .slice(0, 2)
                      .map((txn) => (
                        <div key={txn.id} className="investment-item">
                          <div className="investment-details">
                            <strong>{txn.category}</strong>: ${txn.amount}
                          </div>
                        </div>
                      ))}
                  </div>
                  <button onClick={handleShowMoreClick} className="show-more-btn">Show More</button>
                </>
              ) : (
                <p>No upcoming investments found.</p>
              )}
            </div>
            <div className="Four">
              <button onClick={() => setShowHistory(true)}>View Transaction History</button>
            </div>
          </div>
        </>
      ) : (
        <div>
          <button onClick={() => setShowHistory(false)}>Back to Dashboard</button>
          <h2>Transaction History</h2>
          <ul>
            {transactions.map((txn) => (
              <li key={txn.id}>
                ${txn.amount} - {txn.category} ({new Date(txn.date).toLocaleDateString()})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
