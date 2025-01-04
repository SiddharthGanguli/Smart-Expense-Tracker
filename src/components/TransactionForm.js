import React, { useState, useRef, useEffect } from "react";
import './trans.css';

const categoryMappings = {
  "Dining": ["restaurant", "cafe", "diner", "coffee", "food", "meal", "bar"],
  "Shopping": ["amazon", "flipkart", "shop", "clothes", "shoes", "store"],
  "Transport": ["uber", "ola", "taxi", "bus", "train", "flight", "car rental"],
  "Entertainment": ["movie", "concert", "ticket", "show", "game", "event"],
  "Groceries": ["supermarket", "groceries", "market", "grocery", "food", "veg", "fruit"],
  "Bills": ["electricity", "internet", "water", "phone", "subscription"],
  "Health": ["pharmacy", "medicine", "doctor", "hospital", "health", "clinic"],
};

const getSuggestedCategory = (description) => {
  const cleanedDescription = description.toLowerCase();

  for (const category in categoryMappings) {
    for (const keyword of categoryMappings[category]) {
      if (cleanedDescription.includes(keyword.toLowerCase())) {
        return category;
      }
    }
  }
  return ""; // Return empty string if no suggestion
};

const TransactionForm = ({
  addTransaction,
  categories,
  addCategory,
  deleteCategory,
}) => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(""); // Manually entered category
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [description, setDescription] = useState(""); // Add description state
  const [suggestedCategory, setSuggestedCategory] = useState(""); // Store suggested category
  const [isAddingCategory, setIsAddingCategory] = useState(false); // Toggle new category input
  const [categoryError, setCategoryError] = useState(""); // Store category error message

  useEffect(() => {
    // Only suggest category if description is not empty and category is not manually entered
    if (description && !category) {
      const suggested = getSuggestedCategory(description);
      setSuggestedCategory(suggested);
    }
  }, [description, category]); // Trigger this effect on description or category change

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Amount:", amount); // Debugging log
    console.log("Category:", category); // Debugging log
    console.log("Date:", date); // Debugging log
    console.log("Description:", description); // Debugging log
    
    // Check if amount, category, and date are filled before submitting
    if (!amount || (!category && !suggestedCategory) || !date) {
      alert("Please fill in all required fields: Amount, Category, and Date.");
      return;
    }

    // Use suggested category if the user hasn't selected one manually
    const finalCategory = category || suggestedCategory;
    addTransaction({ amount, category: finalCategory, date, note, description });
    setAmount("");
    setCategory("");
    setDate("");
    setNote("");
    setDescription("");
    setSuggestedCategory(""); // Reset suggested category after submission
  };

  const handleAddNewCategory = (e) => {
    e.preventDefault();
    if (category.trim()) {
      if (categories.includes(category.trim())) {
        setCategoryError("Category already exists or is empty.");
      } else {
        addCategory(category.trim());
        setCategory(""); // Reset category field
        setIsAddingCategory(false); // Hide new category input
        setCategoryError(""); // Clear any previous error
      }
    } else {
      setCategoryError("Category already exists or is empty.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      {/* Amount Input */}
      <div className="form-group">
        <label htmlFor="amount">Amount:</label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter your amount"
          className="input-box"
          required
        />
      </div>

      {/* Description Input */}
      <div className="form-group">
        <label htmlFor="description">Transaction Description:</label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter the transaction description (e.g., Amazon, Grocery)"
          className="input-box"
        />
      </div>

      {/* Category Input with Suggestions */}
      <div className="form-group">
        <label htmlFor="category">Category:</label>
        <div className="category-input-wrapper">
          <input
            id="category"
            type="text"
            value={category || suggestedCategory} // Show suggested category if none selected
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Select or type a category"
            className="input-box"
          />
          {suggestedCategory && !category && (
            <p className="suggested-category">Suggested Category: {suggestedCategory}</p>
          )}
          {/* Add New Category Button */}
          <button
            type="button"
            className="add-category-btn"
            onClick={() => setIsAddingCategory(!isAddingCategory)}
          >
            + {/* Small "+" button to add category */}
          </button>
        </div>

        {/* Manual Category Input (when "+" is clicked) */}
        {isAddingCategory && (
          <div className="new-category-input">
            <input
              id="newCategory"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter new category"
              className="input-box"
            />
            <button onClick={handleAddNewCategory} className="submit-category-button">
              Add Category
            </button>
          </div>
        )}

        {/* Category Error Message */}
        {categoryError && (
          <p className="category-error">{categoryError}</p>
        )}
      </div>

      {/* Date Input */}
      <div className="form-group">
        <label htmlFor="date">Date:</label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input-box"
          required
        />
      </div>

      {/* Submit Button */}
      <button type="submit" className="submit-button">
        Add Transaction
      </button>
    </form>
  );
};

export default TransactionForm;
