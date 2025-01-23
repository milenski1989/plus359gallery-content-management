import { Autocomplete, TextField } from '@mui/material';

function CustomAutocomplete({options, value, label, onChange, disabled = false, className = ''}) {
  return (
    <Autocomplete
      className={className}
      disablePortal
      options={options}
      value={value}
      disabled={disabled}
      renderInput={(params) => <TextField {...params} label={label}/>}
      onChange={(event, newValue) => onChange(newValue)}
      isOptionEqualToValue={(option, value) => option === value}
      getOptionLabel={(option) => option.toString()}
    />
  );
}

export default CustomAutocomplete;