import { Button, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";

import './HomePage.css';

const homePageButtons = [
  {name: 'Locations', location: '/locations'},
  {name: 'Upload Artworks', location: '/upload-artworks'},
  // {name: 'Documents', location: '/documents'},
  // {name: 'Upload Documents', location: '/upload-documents'}
];

function HomePage() {

  const navigate = useNavigate();
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  return (
    <div className={`home-page-content ${isSmallDevice ? 'mobile-home-page-content' : ''}`}>
      {homePageButtons.map(({name, location}) => (
        <Button key={name} variant="outlined" onClick={() => navigate(location)}>{name}</Button>
      ))}
    </div>
  );
};

export default HomePage;