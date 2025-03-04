import { Link, useLocation } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect } from "react";
import Logo from '../../assets/logo359 gallery-white.png';

function MobileNavigation({isOpen, setIsOpen, renderNavLinks}) {

  const {pathname} = useLocation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  },[isOpen]);

  return (
    <nav className="mobile-navbar">
      <Link to='/'><img className="mobile-logo" alt="logo" src={Logo} /></Link>
      {pathname.includes('gallery') && (
        <p className="mobile-current-location">
          {decodeURIComponent(pathname.split('/').pop().replace(/([A-Z])/g, ' $1'))}
        </p>
      )}
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