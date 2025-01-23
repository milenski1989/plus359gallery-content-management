import { TextField } from '@mui/material';

function CustomTextfield({placeholder, sx, handleChange, slotProps}) {
  return (
    <TextField
      placeholder={placeholder}
      style={sx}
      onChange={handleChange}
      slotProps={ slotProps ? slotProps : null}/>
  );
}

export default CustomTextfield;