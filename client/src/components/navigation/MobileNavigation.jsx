import { Link, useLocation, useNavigate } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { navLinks } from "./NavigationLayout";
import { useEffect, useState } from "react";
import { handleLogout } from "./helperFunctions";
import Logo from '../../assets/logo359 gallery-white.png';

function MobileNavigation() {

  let navigate = useNavigate();
  const {pathname} = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  },[isOpen]);

  const renderNavLinks = () => {
    return navLinks.map(({ path, name, func }) => {
      const handleClick = () => {
        if (func === 'handleLogout') {
          handleLogout(navigate);
        }
        setIsOpen(false);
      };
      return (
        <Link
          key={name}
          to={path}
          onClick={handleClick}
          className={"mobile-nav-link"}
        >
          {name}
        </Link>
      );
    });
  };

  return (
    <nav className="mobile-navbar">
      <Link to='/'><img className="mobile-logo" alt="logo" src={Logo} /></Link>
      <p className="mobile-current-location">{pathname === '/admin-panel' || pathname === '/storages-management' ? '' : pathname.slice(10).replace(/%20/g, ' ').replace(/([A-Z])/g, ' $1')}</p>
      {isOpen ? (
        <CloseIcon sx={{color: '#40C8F4'}} onClick={() => setIsOpen(false)}/>
      ) : (
        <MenuIcon sx={{color: '#40C8F4'}} onClick={() => setIsOpen(true)}/>
      )}
      <div className={isOpen ? "mobile-navlinks active overlay" : "mobile-navlinks"}>
        {renderNavLinks()}
      </div>
   
    </nav>
  );
}

export default MobileNavigation;