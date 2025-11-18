import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';

function App() {
  const [theme, setTheme] = useState('dark');

  // Apply theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Home theme={theme} toggleTheme={toggleTheme} />
      <Footer />
    </div>
  );
}

export default App;
