// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import RepaymentsPage from './components/RepaymentsPage';
import ViewTransaction from './components/ViewTransaction';  // Import the new component

const App = () => {
  return (
      <Routes>
        <Route path="/" element={<Dashboard />} /> {/* Dashboard route */}
        <Route path="/repayments" element={<RepaymentsPage />} /> {/* Repayments route */}
        <Route path="/viewtransaction" element={<ViewTransaction />} /> {/* New route for transactions */}
      </Routes>
  );
};

export default App;
