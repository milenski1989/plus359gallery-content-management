import { Link, useLocation } from "react-router-dom";
import Logo from '../../assets/logo359 gallery-white.png';

function Navigation({renderNavLinks}) {
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-elements-container">
        <Link to="/">
          <img className="logo" alt="logo" src={Logo} />
        </Link>
        {pathname.includes('gallery') && (
          <p className="current-location">
            {decodeURIComponent(pathname.split('/').pop().replace(/([A-Z])/g, ' $1'))}
          </p>
        )}
        <div className="right-side">
          {renderNavLinks()}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
