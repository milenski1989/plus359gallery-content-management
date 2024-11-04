import { Link, useNavigate, useLocation, Outlet } from "react-router-dom"
import './NavigationLayout.css'
import { useMediaQuery } from "@mui/material";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import Logo from '../../assets/logo359 gallery-white.png'

const navLinks = [
    {name: 'Home', path: '/'},
    {name: 'Upload', path: '/upload'},
    {name: 'Account', path: '/account'},
    {name: 'Admin Panel', path: '/admin-panel'},
    {name: 'Log Out', path: '/login', func: 'handleLogout'}
]

const NavigationLayout = () => {

    let navigate = useNavigate();
    const {pathname} = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    },[isOpen])

    const handleLogout = () => {
        window.localStorage.clear()
        window.sessionStorage.clear()
        navigate('/login')
    }

    const renderNavLinks = () => {
        return navLinks.map(({ path, name, func }) => {
            const handleClick = () => {
                if (func === 'handleLogout') {
                    handleLogout();
                }
                setIsOpen(false);
            };
            return (
                <Link
                    key={name}
                    to={path}
                    onClick={handleClick}
                    className={isSmallDevice ? "mobile-nav-link" : "nav-link"}
                >
                    {name}
                </Link>
            );
        });
    };

    return  <>
        {isSmallDevice ?
            <><nav className="mobile-navbar">
                <Link to='/'><img className="mobile-logo" alt="logo" src={Logo} /></Link>
                <p className="mobile-current-location">{pathname === '/admin-panel' || pathname === '/storages-management' ? '' : pathname.slice(10).replace(/%20/g, ' ').replace(/([A-Z])/g, ' $1')}</p>
                <button
                    onClick={() => {
                        setIsOpen(!isOpen);
                    } }
                    className="mobile-navbar-button"
                >
                    {isOpen ? (
                        <XIcon className="h-6 w-6" aria-hidden="true" />
                    ) : (
                        <MenuIcon className="h-6 w-6" aria-hidden="true" />
                    )}
                </button>
                <div className={isOpen ? "mobile-navlinks active overlay" : "mobile-navlinks"}>
                    {renderNavLinks()}
                </div>

            </nav><div className="main-section">
                <Outlet />
            </div></>
            :
            <><nav className="navbar">
                <div className="navbar-elements-container">
                    <Link to='/'><img className="logo" alt="logo" src={Logo} /></Link>
                    <p className="current-location">{pathname === '/admin-panel' || pathname === '/storages-management' ? '' : pathname.slice(10).replace(/%20/g, ' ').replace(/([A-Z])/g, ' $1')}</p>
                    <div className="right-side">
                        {renderNavLinks()}
                    </div>
                </div>
            </nav>
            <div className="main-section">
                <Outlet />
            </div>
        
            </>
        } 
    </>
}

export default NavigationLayout