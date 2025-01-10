import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" className="logo">
          CryptoTracker
        </Link>
        
        <div className="nav-right">
          <div className="nav-links">
            <Link to="/markets">Markets</Link>
            <Link to="/watchlist">Watchlist</Link>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 