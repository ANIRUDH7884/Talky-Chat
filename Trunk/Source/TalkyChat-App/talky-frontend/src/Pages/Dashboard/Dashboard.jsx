import { useEffect, useState } from 'react';
import { FiLogOut } from 'react-icons/fi';
import './Dashboard.scss';

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="logo">TalkyChat</div>
        <div className="user-info">
          <span className="username">{user?.username || 'User'}</span>
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut />
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-main">
        <h1>👷‍♂️ Dashboard is Coming Soon!</h1>
        <p>Stay tuned for exciting features 🛠️</p>
      </div>
    </div>
  );
};

export default Dashboard;
