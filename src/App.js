import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import RepaymentsPage from './components/RepaymentsPage';

const App = () => {
  return (
      <Routes>
        <Route path="/" element={<Dashboard />} /> {/* Dashboard route */}
        <Route path="/repayments" element={<RepaymentsPage />} /> {/* Repayments route */}
      </Routes>
  );
};

export default App;
