import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center" sx={{marginTop: '2rem'}}>
      {'Copyright © '}
      <Link color="inherit" href="http://plus359gallery.com" style={{textDecoration: 'none', color: '#007bff'}}>
            +359 Gallery
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}