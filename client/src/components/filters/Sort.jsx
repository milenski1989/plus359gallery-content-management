import { Autocomplete, TextField } from '@mui/material';
import AscIcon from '../../assets/ascending-solid.svg';
import DescIcon from '../../assets/descending-solid.svg';
import { useContext } from 'react';
import { EntriesContext } from '../contexts/EntriesContext';

const sortOptions = [
  { label: 'Date', field: 'id' },
  { label: 'Position', field: 'position' },
  { label: 'Artist', field: 'artist' },
  { label: 'Title', field: 'title' },
];

function Sort() {

  const {
    sortField,
    sortOrder,
    setSortField,
    setSortOrder
  } = useContext(EntriesContext);

  const handleSort = (_, newValue) => {
    if (newValue) {
      if (sortField === newValue.field) {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(newValue.field);
        setSortOrder('asc');
      }
    } else {
      setSortField('id');
      setSortOrder('desc');
    }
  };

  return (
    <div>
      <Autocomplete
        value={{ label: `${sortOptions.find(option => option.field === sortField).label}`, field: sortField, order: sortOrder }}
        options={sortOptions}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.field === value.field} 
        onChange={handleSort}
        renderInput={(params) => 
          <TextField
            {...params}
            slotProps={{input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {sortOrder === 'asc' && <img className='end-adornment' src={AscIcon} />}
                  {sortOrder === 'desc' && <img className='end-adornment' src={DescIcon} />}
                </>
              )
            }}}
          />
        }
        renderOption={(props, option) => (
          <li {...props} >
            {option.label}
            {sortField === option.field && (
              <>
                {sortOrder === 'asc' && <img style={{position: 'absolute', right: '10px'}} src={DescIcon} />}
                {sortOrder === 'desc' && <img style={{position: 'absolute', right: '10px'}} src={AscIcon} />}
              </>
            )}
          </li>
        )} 
      />
    </div>
  );
}

export default Sort;