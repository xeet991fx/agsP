import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Prompts from './pages/Prompts';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/prompts" element={<Prompts />} />
      </Routes>
    </Router>
  );
}

export default App;
