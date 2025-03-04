import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import './BasicMenu.css';

export default function BasicMenu({menuButton, menuItems, handleMenuItemClick}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <div
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        className="basic-menu"
        onClick={handleClick}
      >
        {menuButton}
      </div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {menuItems.map(item => (
          <MenuItem 
            key={item.id}
            onClick={() => {
              handleMenuItemClick(item);
              setAnchorEl(null);
            }}
          >
            {item.name}
          </MenuItem>
        ))}

      </Menu>
    </div>
  );
}
