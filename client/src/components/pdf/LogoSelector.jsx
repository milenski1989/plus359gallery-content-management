import { InputLabel, MenuItem, Select } from '@mui/material';
import { logos } from './helpers/constants';

function LogoSelector({logoName, setLogoName, onLogoUpdate }) {

  const getBase64FromPath = async (imagePath, callBack) => {
    try {
      const response = await fetch(imagePath);
      const blob = await response.blob();
          
      const reader = new FileReader();
      reader.readAsDataURL(blob);
          
      reader.onload = function () {
        callBack(reader.result);
      };
          
      reader.onerror = function (error) {
        console.error('Error converting image to base64:', error);
      };
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };
    
  const handleSelectLogo = (name) => {
    getBase64FromPath(`/images/${name}.jpg`, (result) => {
      setLogoName(name);
      onLogoUpdate(result);
    });
  };
  
  return (
    <>
      <InputLabel>Select logo</InputLabel>
      <Select
        value={logoName}
        sx={{ width: '70%' }}
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