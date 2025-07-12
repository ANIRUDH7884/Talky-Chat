import { 
  FiMessageSquare, 
  FiBell, 
  FiSettings 
} from 'react-icons/fi';
import './Sidebar.scss';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-icons">
        <button className="sidebar-icon active">
          <FiMessageSquare size={20} />
        </button>
        <button className="sidebar-icon">
          <FiBell size={20} />
        </button>
        <button className="sidebar-icon">
          <FiSettings size={20} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;