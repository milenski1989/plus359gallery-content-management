import { Outlet } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import MobileNavigation from "./MobileNavigation";
import Navigation from "./Navigation";

import './NavigationLayout.css';

export const navLinks = [
  {name: 'Home', path: '/'},
  {name: 'Account', path: '/account'},
  {name: 'Admin Panel', path: '/admin-panel'},
  {name: 'Log Out', path: '/login', func: 'handleLogout'}
];

const NavigationLayout = () => {

  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  return  <>
    {isSmallDevice ?
      <MobileNavigation/>
      :
      <Navigation/>
    } 
    <div className="main-section">
      <Outlet />
    </div>
  </>;
};

export default NavigationLayout;