// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistrationPage from './components/Registration.jsx';
import LoginPage from './components/Login.jsx';
import ResetPassword from '../src/components/ResetPassword.jsx'
import CertificationScreen from './components/Quest.jsx';

function App() {
//const userId = sessionStorage.getItem('userId'); // Retrieve it from session storage

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/Quest" element={<CertificationScreen  />}/>
      </Routes>
    </Router>
  );
}

export default App;
