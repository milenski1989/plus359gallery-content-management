import { InputLabel, MenuItem, Select, useMediaQuery } from '@mui/material';
import { logos } from './helpers/constants';
import { loadAndResizeImage } from './helpers/utilityFunctions';

function LogoSelector({onLogoUpdate }) {

  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const sx = {width: isSmallDevice ? '80vw' : '70%'};

  const handleSelectLogo = async (name) => {
    try {
      const imageUrl = `/images/${name}.jpg`;
      const { resizedUrl, resizedWidth, resizedHeight } = await loadAndResizeImage(imageUrl, 700);
      
      onLogoUpdate({url: resizedUrl, width: resizedWidth, height: resizedHeight});
    } catch (error) {
      console.error("Error handling logo selection:", error);
    }
  };
  
  return (
    <>
      <InputLabel>Select logo</InputLabel>
      <Select
        sx={sx}
        onChange={(e) => handleSelectLogo(e.target.value)}
                 
      >
        {logos.map((option, index) => (
          <MenuItem key={index} value={option}>{option}</MenuItem>
        ))}
      </Select>
    </>
  );
}

export default LogoSelector;