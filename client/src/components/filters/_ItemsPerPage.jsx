import { MenuItem, Select } from '@mui/material';
import { useContext } from 'react';
import { EntriesContext } from '../contexts/EntriesContext';

const countPerPageOptions = [25, 50, 100, 150, 200];

function ItemsPerPage() {

  const {
    countPerPage,
    setCountPerPage,
    setPage
  } = useContext(EntriesContext);

  const handleCountPerPageChange = (event) => {
    setPage(1);
    setCountPerPage(event.target.value);
  };

  return (
    <>
      <Select
        value={countPerPage}
        onChange={handleCountPerPageChange}
      >
        {countPerPageOptions.map((option, index) => (
          <MenuItem key={index} value={option}>{option}</MenuItem>
        ))}
      </Select>
    </>
  );
}

export default ItemsPerPage;