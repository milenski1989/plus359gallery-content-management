import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import './SearchAndFiltersBar.css';
import { useParams } from 'react-router-dom';
import { filterAll, getAll } from '../../api/artworksService';
import { getCellsFromStorage } from '../../api/storageService';
import { getArtistsInStorage } from '../../api/artistsService';
import { EntriesContext } from '../contexts/EntriesContext';
import Sort from './Sort';
import ViewModeIcons from './ViewModeIcons';
import useNotification from '../hooks/useNotification';
import CustomAutocomplete from '../reusable/CustomAutocomplete';

const countPerPageOptions = [25, 50, 100, 150, 200];

function SearchAndFiltersBar({
  setPaginationDisabled,
  handleSearchResults,
  triggerFetch,
  viewMode,
  handleViewMode,
}) {
  const { showError } = useNotification();

  const [artists, setArtists] = useState([]);
  const [cells, setCells] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState();
  const [selectedCell, setSelectedCell] = useState();
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('desc');
  const [keywords, setKeywords] = useState([]);

  const {name} = useParams();

  const {
    page,
    setPage,
    setTotalCount,
    setPagesCount,
    countPerPage,
    setCountPerPage,
    startItem,
    endItem,
    totalCount
  } = useContext(EntriesContext);

  const getArtists = async () => {
    try {
      const response = await getArtistsInStorage(name);
      const data = response.data;
      setArtists(data);
    } catch (error) {
      showError(error.response.data.message);
    }
  };

  const artistOptions = useMemo(() => artists.map(artist => artist.artist), [artists]);

  const getCells = async () => {
    try {
      const response = await getCellsFromStorage(name);
      const uniqueCells = [...new Set(response.data)];
      setCells(uniqueCells);
    } catch (error) {
      showError(error.response.data.message);
    }
  };

  const onChange = useCallback((event) => {
    if (!event.target.value) return setKeywords([]);
    setKeywords(event.target.value.split(' '));
  }, []);

  const getPaginatedData = async () => {
    try {
      const response = await getAll(page, countPerPage, sortField, sortOrder, name);

      const { arts, artsCount } = await response.data;
      handleSearchResults(arts);
      setPaginationDisabled(false);
      setPagesCount(Math.ceil(artsCount / countPerPage));
      setTotalCount(artsCount);
    } catch(error) {
      showError(error.response.data.message);
    }
  };

  const filterData = async () => {
    try {

      const response = await filterAll(keywords, selectedArtist, selectedCell, sortField, sortOrder);
      const {artworks, totalCount} = response.data;
      handleSearchResults(artworks);
      setTotalCount(totalCount);
      setPaginationDisabled(true);
    } catch(error) {
      showError(error.response.data.message);
    }
  };

  useEffect(() => {
    getArtists();
    getCells();
  },[name]);

  useEffect(() => {
    let filterTimeOut = null;
    if (!selectedArtist && !selectedCell && !keywords.length) {
      getPaginatedData();
    }
    else {
      filterTimeOut = setTimeout(() => {
        filterData();
      }, 500);
    }

    return () =>  clearTimeout(filterTimeOut);
  }, [page, sortField, sortOrder, triggerFetch, selectedArtist, selectedCell, keywords, countPerPage]);

    
  const handleCountPerPageChange = (event) => {
    setPage(1);
    setCountPerPage(event.target.value);
  };

  const renderCountInfo = useMemo(() => {
    if (keywords.length || selectedArtist || selectedCell) {
      return <>Showing <span className="bolded">{startItem}-{totalCount}</span> of <span className="bolded">{totalCount}</span></>;
    }
    return <>Showing <span className="bolded">{startItem}-{endItem}</span> of <span className="bolded">{totalCount}</span></>;
  }, [keywords, selectedArtist, selectedCell, startItem, endItem, totalCount]);

  return <>
    <div className="filters-container">
      <FormControl
        sx={{ 
          '& label': {
            '&:hover': {
              color: 'rgba(0,0,0,0.6)'
            },
            '&.Mui-focused': {
              color: 'rgba(0,0,0,0.6)'
            }
          }
        }}
      >
        <InputLabel id="demo-simple-select-label">Show</InputLabel>
        <Select
          className="filter-input"
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={countPerPage}
          label="Show"
          onChange={handleCountPerPageChange}
                   
        >
          {countPerPageOptions.map((option, index) => (
            <MenuItem key={index} value={option}>{option}</MenuItem>
          ))}
        
        </Select>
      </FormControl>
      <Sort
        sortField={sortField}
        handleSortField={setSortField}
        sortOrder={sortOrder}
        handleSortOrder={setSortOrder}
      />
      <CustomAutocomplete
        className="filter-input"
        options={artistOptions}
        label="Select artist"
        onChange={setSelectedArtist}
      />
      <CustomAutocomplete
        className="filter-input"
        options={cells}
        label="Select cell"
        onChange={setSelectedCell}
      />
      <TextField 
        className="filter-input"
        id="outlined-basic" 
        label="Search..." 
        variant="outlined"
        onChange={onChange}
      />
      <div className="entries-shown-view-mode-icons">
        <div className="entries-shown">
          {renderCountInfo}
        </div>
        <ViewModeIcons viewMode={viewMode} handleViewMode={handleViewMode} />
      </div>
    </div>
  </>;
}

export default SearchAndFiltersBar;