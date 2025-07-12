import { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import './Layout.scss';

const Layout = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div className={`app-layout ${isDarkMode ? 'dark' : ''}`}>
      <Sidebar />
      <div className="content">
        <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
