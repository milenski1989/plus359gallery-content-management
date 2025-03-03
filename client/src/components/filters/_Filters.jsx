import { TextField } from '@mui/material';
import { useCallback, useContext } from 'react';
import Sort from './Sort';
import ItemsPerPage from './_ItemsPerPage';
import ArtistCellFilter from './_ArtistCellFilter';

import './_Filters.css';
import { EntriesContext } from '../contexts/EntriesContext';

function Filters() {

  const {
    keywords,
    setKeywords
  } = useContext(EntriesContext);

  const handleChangeKeywords = useCallback((event) => {
    if (!event.target.value) return setKeywords([]);
    setKeywords(event.target.value.split(' '));
  }, []);

  return <>
    <div className="filters-container">
      <ItemsPerPage />
      <Sort/>
      <ArtistCellFilter/>
      <TextField 
        className="search-field"
        label="Search..." 
        variant="outlined"
        onChange={handleChangeKeywords}
        value={keywords.join(" ")} 
      />
    </div>
  </>;
}

export default Filters;