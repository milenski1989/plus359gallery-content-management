import { Link, useLocation, useNavigate } from "react-router-dom";
import { handleLogout } from "./helperFunctions";
import { navLinks } from "./NavigationLayout";
import Logo from '../../assets/logo359 gallery-white.png';

function Navigation() {

  let navigate = useNavigate();
  const {pathname} = useLocation();

  const renderNavLinks = () => {
    return navLinks.map(({ path, name, func }) => {
      const handleClick = () => {
        if (func === 'handleLogout') handleLogout(navigate);
      };
      return (
        <Link
          key={name}
          to={path}
          onClick={handleClick}
          className={"nav-link"}
        >
          {name}
        </Link>
      );
    });
  };

  return (
    <nav className="navbar">
      <div className="navbar-elements-container">
        <Link to='/'><img className="logo" alt="logo" src={Logo} /></Link>
        <p className="current-location">{pathname === '/admin-panel' || pathname === '/storages-management' ? '' : pathname.slice(10).replace(/%20/g, ' ').replace(/([A-Z])/g, ' $1')}</p>
        <div className="right-side">
          {renderNavLinks()}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;