import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import './Dashboard.css';

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

  // Calculate total investment for current month
  const getTotalInvestmentForCurrentMonth = () => {
    const currentDate = new Date();
    const currentMonthKey = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}`;
    return monthlyTotals[currentMonthKey] || 0;
  };

  // Find highest investment month
  const getHighestInvestmentMonth = () => {
    let highestMonth = '';
    let highestAmount = 0;
    Object.entries(monthlyTotals).forEach(([monthKey, total]) => {
      if (total > highestAmount) {
        highestAmount = total;
        highestMonth = monthKey;
      }
    });

    if (highestMonth) {
      const [year, month] = highestMonth.split('-');
      const monthName = new Date(`${year}-${month}-01`).toLocaleString('default', { month: 'long' });
      return `${monthName} ${year}`;
    }
    return '';
  };

  // Calculate total investment and highest investment month
  const totalCurrentMonthInvestment = getTotalInvestmentForCurrentMonth();
  const highestInvestmentMonth = getHighestInvestmentMonth();

  // Chart Data for Categories
  const categoryChartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      },
    ],
  };

  // Chart Data for Monthly Totals
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

  // Fix for Upcoming Repayment Logic (If Required)
  const sortedRepayments = transactions
    .filter((txn) => txn.isRecurring)
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sorting by date

  const groupedRepayments = sortedRepayments.reduce((groups, txn) => {
    const dueDate = new Date(txn.date).toLocaleDateString(); // Convert to date string for comparison
    if (!groups[dueDate]) groups[dueDate] = [];
    groups[dueDate].push(txn);
    return groups;
  }, {});

  const closestRepaymentDates = Object.keys(groupedRepayments)
    .sort((a, b) => new Date(a) - new Date(b));

  return (
    <div className="app-container">
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
          {closestRepaymentDates.length > 0 ? (
            <>
              {closestRepaymentDates.slice(0, 1).map((date) => (
                <div key={date} className="investments-group">
                  <h3>Due on {date}</h3>
                  <div className="investments-grid">
                    {groupedRepayments[date].map((txn) => (
                      <div key={txn.id} className="investment-item">
                        <div className="investment-details">
                          <strong>{txn.category}</strong>: ₹{txn.amount}
                        </div>
                        <div className="investment-due">
                          Due in {Math.ceil(
                            (new Date(txn.date) - new Date()) / (1000 * 60 * 60 * 24)
                          )} days
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={() => navigate('/repayments')} className="show-more-btn">Show More</button>
            </>
          ) : (
            <p>No upcoming repayments found.</p>
          )}
        </div>

        {/* Updated Fourth Div */}
        <div className="fourth-div-container">
          <h2 className="fourth-div-heading">Investment Summary</h2>
          <div className="fourth-div-info">
            <div className="low-light-box">
              <p><span className="info-bold">Total Investment for Current Month:</span> ₹{totalCurrentMonthInvestment}</p>
              <p><span className="info-bold">Highest Investment Month:</span> {highestInvestmentMonth}</p>
            </div>
          </div>
          <div className="fourth-div-button-container">
            <Link to="/viewtransaction">
              <button className="view-history-btn">View Transaction History</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
