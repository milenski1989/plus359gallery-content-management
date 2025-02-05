import { InputAdornment, Tooltip } from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

function EndAdornment({handleClick}) {
  return (
    <Tooltip title="Swap the fields in the pdf and/or change their values" placement='top'>
      <InputAdornment sx={{cursor: 'pointer'}} position="end">
        <SwapHorizIcon onClick={handleClick} />
      </InputAdornment>
    </Tooltip>
  );
}

export default EndAdornment;