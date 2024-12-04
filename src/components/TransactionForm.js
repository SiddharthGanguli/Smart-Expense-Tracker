import React, { useState } from 'react';

const TransactionForm = ({ addTransaction, categories, addCategory, deleteCategory }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount && category && date) {
      addTransaction({ amount, category, date, note, isRecurring });
      setAmount('');
      setCategory('');
      setDate('');
      setNote('');
      setIsRecurring(false);
    }
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategory) {
      addCategory(newCategory);
      setNewCategory('');
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCategorySelect = (category) => {
    setCategory(category);
    setIsDropdownOpen(false);
  };

  const handleDeleteCategory = (category) => {
    deleteCategory(category);
    setCategory('');
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
        />
      </div>

      {/* Custom Category Dropdown */}
      <div className="form-group">
        <label htmlFor="category">Category:</label>
        <div className="custom-dropdown">
          <input
            type="text"
            value={category}
            onClick={toggleDropdown}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Select or type a category"
            className="input-box"
            readOnly
          />
          {isDropdownOpen && (
            <div className="category-list">
              {categories.map((cat) => (
                <div key={cat} className="category-item">
                  <span onClick={() => handleCategorySelect(cat)}>{cat}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCategory(cat);
                    }}
                    className="delete-category-button"
                  >
                    &#x2716; {/* Unicode for cross */}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
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
        />
      </div>

      {/* Note Input */}
      <div className="form-group">
        <label htmlFor="note">Note:</label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Enter a note"
          className="input-box note-box"
        ></textarea>
      </div>

      {/* Recurring Checkbox */}
      <div className="form-group">
        <label htmlFor="isRecurring">Recurring:</label>
        <input
          id="isRecurring"
          type="checkbox"
          checked={isRecurring}
          onChange={(e) => setIsRecurring(e.target.checked)}
          className="checkbox"
        />
      </div>

      {/* Submit Button */}
      <button type="submit" className="submit-button">
        Add Transaction
      </button>

      {/* Add Category */}
      <div className="form-group category-add">
        <label htmlFor="newCategory">Add New Category:</label>
        <input
          id="newCategory"
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Enter new category"
          className="input-box"
        />
        <button onClick={handleAddCategory} className="add-category-button">
          Add Category
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
