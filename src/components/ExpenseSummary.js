// src/components/ExpenseSummary.js

import React, { useEffect, useState } from "react";
import { fetchExpenses, categorizeExpenses } from "../utils/expenseUtils";

const ExpenseSummary = () => {
  const [categoryTotals, setCategoryTotals] = useState({});

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const expenses = await fetchExpenses(); // Fetch data
        const totals = categorizeExpenses(expenses); // Categorize and calculate totals
        setCategoryTotals(totals);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    loadExpenses();
  }, []);

  return (
    <div>
      <h1>Expense Summary</h1>
      <ul>
        {Object.keys(categoryTotals).map((category) => (
          <li key={category}>
            {category.charAt(0).toUpperCase() + category.slice(1)} Invest = ${categoryTotals[category]}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseSummary;
