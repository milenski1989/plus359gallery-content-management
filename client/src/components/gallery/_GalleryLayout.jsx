import { useContext, useEffect, useMemo, useState } from "react";
import { EntriesContext } from "../contexts/EntriesContext";
import useNotification from "../hooks/useNotification";
import { filterAll, getAll } from "../../api/artworksService";
import { useParams } from "react-router-dom";
import Filters from "../filters/_Filters";
import ViewModeIcons from "../filters/ViewModeIcons";
import { useMediaQuery } from "@mui/material";
import ThumbnailView from "./ThumbnailView";
import DetailsView from "./details view/DetailsView";
import MobileListView from "./list view/MobileListView";
import ListView from "./list view/ListView";
import GalleryContent from "./_GalleryContent";
import PaginationComponent from '../PaginationComponent';

import './_GalleryLayout.css';

function GalleryLayout() {

  const {
    page,
    setTotalCount,
    setPagesCount,
    countPerPage,
    startItem,
    endItem,
    totalCount
  } = useContext(EntriesContext);

  const { showError } = useNotification();
  const {name} = useParams();
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  const [searchResults, setSearchResults] = useState([]);
  const [viewMode, setViewMode] = useState('details');
  const [dialogType, setDialogType] = useState(null);
  const [paginationDisabled, setPaginationDisabled] = useState(false);
  const [triggeredFetchArtworks, setTriggeredFetchArtworks] = useState(false);
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedArtist, setSelectedArtist] = useState();
  const [selectedCell, setSelectedCell] = useState();
  const [keywords, setKeywords] = useState([]);

  useEffect(() => {
    let filterTimeOut = null;
    if (!selectedArtist && !selectedCell && keywords.length === 0) {
      getPaginatedData();
    } else {
      filterTimeOut = setTimeout(() => {
        filterData();
      }, 500);
    }
    return () => clearTimeout(filterTimeOut);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedArtist,
    selectedCell,
    keywords,
    page,
    sortField,
    sortOrder,
    countPerPage,
    triggeredFetchArtworks
  ]);

  const getPaginatedData = async () => {
    try {
      const response = await getAll(page, countPerPage, sortField, sortOrder, name);
    
      const { arts, artsCount } = await response.data;
      setSearchResults(arts);
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
      setSearchResults(artworks);
      setTotalCount(totalCount);
      setPaginationDisabled(true);
    } catch(error) {
      showError(error.response.data.message);
    }
  };

  const memoizedViewMode = useMemo(() => {
    switch (viewMode) {
    case 'thumbnail':
      return <ThumbnailView searchResults={searchResults} />;
    case 'details': 
      return <DetailsView setDialogType={setDialogType} searchResults={searchResults} />;
    default:
      return isSmallDevice 
        ? <MobileListView searchResults={searchResults} handleDialogType={setDialogType} /> 
        : <ListView searchResults={searchResults} handleDialogType={setDialogType} />;
    }
  }, [viewMode, searchResults, isSmallDevice]);

  const renderCountInfo = useMemo(() => {
    if (keywords.length || selectedArtist || selectedCell) {
      return <p>Showing <span className="bolded"> {startItem}-{totalCount} </span> of <span className="bolded"> {totalCount} </span></p>;
    }
    return <p>Showing <span className="bolded"> {startItem}-{endItem} </span> of <span className="bolded"> {totalCount} </span></p>;
  }, [keywords, selectedArtist, selectedCell, startItem, endItem, totalCount]);

  return (
    <>
   
      <Filters  
        setKeywords={setKeywords}
        setSelectedArtist={setSelectedArtist}
        setSelectedCell={setSelectedCell}
        sortField={sortField}
        sortOrder={sortOrder}
        setSortField={setSortField}
        setSortOrder={setSortOrder}
      />
      <div className="entries-count-view-mode-container">
        {renderCountInfo}
        <ViewModeIcons viewMode={viewMode} handleViewMode={setViewMode} />
      </div>
      {!searchResults.length ?
        <div className="no-data-container">Nothing was found!</div>
        :
        <GalleryContent 
          searchResults={searchResults} 
          dialogType={dialogType} 
          setDialogType={setDialogType}
          viewMode={viewMode}
          setTriggeredFetchArtworks={setTriggeredFetchArtworks}
        />
      }
      {memoizedViewMode}
      {searchResults.length && !paginationDisabled ?
        <PaginationComponent /> :
        null
      }
    </>
  );
}

export default GalleryLayout;