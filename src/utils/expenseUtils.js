// src/utils/expenseUtils.js

// Fetch expenses from your database (example: Firebase)
import { getFirestore, collection, getDocs } from "firebase/firestore";

export const fetchExpenses = async () => {
  const db = getFirestore();
  const expensesCollection = collection(db, "expenses");
  const expensesSnapshot = await getDocs(expensesCollection);

  const expenses = expensesSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
  return expenses;
};

// Categorize expenses and calculate totals
export const categorizeExpenses = (expenses) => {
  const categoryTotals = {};

  expenses.forEach(({ category, amount }) => {
    if (!categoryTotals[category]) {
      categoryTotals[category] = 0;
    }
    categoryTotals[category] += amount;
  });

  return categoryTotals;
};
