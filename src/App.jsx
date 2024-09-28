// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistrationPage from './components/Registration.jsx';
import LoginPage from './components/Login.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
