import { TextField } from '@mui/material';
import { useCallback } from 'react';
import Sort from './Sort';
import ItemsPerPage from './_ItemsPerPage';
import ArtistCellFilter from './_ArtistCellFilter';

import './_Filters.css';

function Filters({
  setKeywords,
  setSelectedArtist,
  setSelectedCell,
  sortField,
  sortOrder,
  setSortField,
  setSortOrder
}) {

  const handleChangeKeywords = useCallback((event) => {
    if (!event.target.value) return setKeywords([]);
    setKeywords(event.target.value.split(' '));
  }, []);

  return <>
    <div className="filters-container">
      <ItemsPerPage />
      <Sort
        sortField={sortField}
        handleSortField={setSortField}
        sortOrder={sortOrder}
        handleSortOrder={setSortOrder}
      />
      <ArtistCellFilter setSelectedArtist={setSelectedArtist} setSelectedCell={setSelectedCell}/>
      <TextField 
        className="search-field"
        label="Search..." 
        variant="outlined"
        onChange={handleChangeKeywords}
      />
    </div>
  </>;
}

export default Filters;