import { Link, Outlet, useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import MobileNavigation from "./MobileNavigation";
import Navigation from "./Navigation";

import './NavigationLayout.css';
import { getAllStorages } from "../../api/storageService";
import { useEffect, useMemo, useState } from "react";
import BasicMenu from "./BasicMenu";
import { handleLogout } from "./helperFunctions";

const navLinks = [
  // { name: 'Account', path: '/account' },
  {
    name: 'Upload',
    subLinks: [
      { name: 'Artworks', path: '/upload-artworks' },
      { name: 'Documents', path: '/upload-documents' }
    ]
  },
  {
    name: 'Locations',
    subLinks: []
  },
  { name: 'Documents', path: '/documents'},
  { name: 'Admin Panel', path: '/admin-panel' },
  { name: 'Log Out', path: '/login', func: 'handleLogout' }
];

const NavigationLayout = () => {

  const navigate = useNavigate();
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const [storages, setStorages] = useState([]);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    fetchStorages();
  }, []);
    
  const fetchStorages = async () => {
    try {
      const response = await getAllStorages();
      setStorages(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const locationMenuItems = useMemo(() => [
    { id: 'all', name: 'All' },
    ...storages.map(storage => ({ id: storage.id, name: storage.name }))
  ], [storages]);
  
  const updatedNavLinks = useMemo(() => {
    const _navLinks = [...navLinks];
    const locationsIndex = _navLinks.findIndex(link => link.name === 'Locations');
    if (locationsIndex !== -1) {
      _navLinks[locationsIndex].subLinks = storages.map(storage => ({
        name: storage.name,
        path: `/gallery/${storage.name}`
      }));
    }
    return _navLinks;
  }, [storages]);

  
  const handleLocationSelect = (item) => {
    navigate(`/gallery/${item.name}`);
    setIsMobileNavOpen(false);
  };
  
  const handleUploadSelect = (item) => {
    if (item.path) {
      navigate(item.path);
      setIsMobileNavOpen(false);
    }
  };

  const renderNavLinks = () => {
    return updatedNavLinks.map(({ name, path, func, subLinks }, index) => {
      if (subLinks && subLinks.length > 0) {
        if (name === "Locations") {
          return (
            <BasicMenu
              key={name + index}
              menuButton="Locations"
              menuItems={locationMenuItems}
              handleMenuItemClick={handleLocationSelect}
            />
          );
        } else {
          const menuItems = subLinks.map(link => ({
            id: link.name,
            name: link.name,
            path: link.path,
          }));
          return (
            <BasicMenu
              key={name + index}
              menuButton={name}
              menuItems={menuItems}
              handleMenuItemClick={handleUploadSelect}
            />
          );
        }
      }
      
      return (
        <Link
          key={name + index}
          to={path}
          onClick={func === 'handleLogout' ? () => handleLogout(navigate) : () => setIsMobileNavOpen(false)}
          className="nav-link"
        >
          {name}
        </Link>
      );
    });
  };

  return  <>
    {isSmallDevice ?
      <MobileNavigation isOpen={isMobileNavOpen} setIsOpen={setIsMobileNavOpen} renderNavLinks={renderNavLinks}/>
      :
      <Navigation renderNavLinks={renderNavLinks}/>
    } 
    <div className="main-section">
      <Outlet />
    </div>
  </>;
};

export default NavigationLayout;