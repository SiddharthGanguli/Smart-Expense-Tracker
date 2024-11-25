import React, { useState } from 'react';
import { getDatabase, ref, push } from "firebase/database";

const TransactionForm = () => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [person, setPerson] = useState(''); // New state for "Lending Money (Udhar)"

  const handleSubmit = (e) => {
    e.preventDefault();

    const db = getDatabase();
    const transactionsRef = ref(db, 'transactions');

    // Save transaction data to Firebase
    const newTransaction = {
      amount,
      category,
      date,
      notes,
      isRecurring,
      person: category === 'Lending Money (Udhar)' ? person : '', // Add person only if category is Udhar
    };

    push(transactionsRef, newTransaction)
      .then(() => {
        alert("Transaction saved successfully!");
        // Reset form
        setAmount('');
        setCategory('');
        setDate('');
        setNotes('');
        setIsRecurring(false);
        setPerson('');
      })
      .catch((error) => {
        alert("Error saving transaction: " + error.message);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Amount:
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          required
        />
      </label>

      <label>
        Category:
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="" disabled>Select Category</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Shopping">Shopping</option>
          <option value="Bills">Bills</option>
          <option value="College Fees">College Fees</option>
          <option value="Health">Health</option>
          <option value="Lending Money (Udhar)">Lending Money (Udhar)</option> {/* New Category */}
          <option value="Other">Other</option>
        </select>
      </label>

      {/* Conditional input for Lending Money (Udhar) */}
      {category === 'Lending Money (Udhar)' && (
        <label>
          Person Name:
          <input
            type="text"
            value={person}
            onChange={(e) => setPerson(e.target.value)}
            placeholder="Enter person's name"
            required
          />
        </label>
      )}

      <label>
        Date:
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </label>

      <label>
        Notes:
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes (optional)"
        />
      </label>

      <label>
        Recurring:
        <input
          type="checkbox"
          checked={isRecurring}
          onChange={(e) => setIsRecurring(e.target.checked)}
        />
      </label>

      <button type="submit">Save Transaction</button>
    </form>
  );
};

export default TransactionForm;
