import { useCallback, useContext, useState } from "react";
import Message from "../reusable/Message";
import "react-lazy-load-image-component/src/effects/blur.css";
import { EntriesContext } from "../contexts/EntriesContext";
import SearchAndFiltersBar from "../filters/SearchAndFiltersBar";
import ThumbnailView from "./ThumbnailView";
import DetailsView from "./DetailsView";
import ListView from "./ListView";
import SelectAllIcon from '../../assets/select-all.svg'
import UnselectAllIcon from '../../assets/unselect-all.svg'
import DeleteDialog from "../reusable/DeleteDialog";
import LocationChangeDialog from "../LocationChangeDialog";
import PaginationComponent from "../PaginationComponent";
import { useMediaQuery } from "@mui/material";
import MobileListView from "./MobileListView";
import './GalleryContent.css'
import Actions from '../reusable/Actions'
import useNotification from "../hooks/useNotification";

const GalleryContent = () => {

  const {
    page,
    setPage,
    currentImages,
    setCurrentImages
  } = useContext(EntriesContext);

  const { error, clearNotifications } = useNotification();

  const [triggerFetch, setTriggerFetch] = useState(false)
  const [searchResults, setSearchResults] = useState([]);
  const [dialogType, setDialogType] = useState(null);
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const [viewMode, setViewMode] = useState('details')
  const [paginationDisabled, setPaginationDisabled] = useState(false);

  const handleDialogType = useCallback((type) => setDialogType(type), []);

  const renderViewMode = useCallback(() => {
    if (viewMode === 'thumbnail') {
      return <ThumbnailView searchResults={searchResults} />;
    } else if (viewMode === 'details') {
      return <DetailsView handleDialogType={handleDialogType} searchResults={searchResults} />;
    } else {
      return isSmallDevice 
        ? <MobileListView searchResults={searchResults} handleDialogType={handleDialogType} /> 
        : <ListView searchResults={searchResults} handleDialogType={handleDialogType} />;
    }
  }, [viewMode, searchResults, handleDialogType, isSmallDevice]);

  const handleTriggerRefresh = useCallback(() => setTriggerFetch(prev => !prev), []);

  const handlePage = (newPage) => {
    setPage(newPage)
  }

  const handleSelectAll = () => {
    if (currentImages.length === searchResults.length) {
      setCurrentImages([]);
    } else {
      setCurrentImages([
        ...currentImages, 
        ...searchResults.filter(image => 
          !currentImages.some(
            currentImage => currentImage.id === image.id
          ))
      ]);
    }
  }

  const renderDialog = () => {
    if (dialogType === 'location') {
      return (
        <LocationChangeDialog 
          handleDialogType={handleDialogType}
          handleTriggerRefresh={handleTriggerRefresh}
        />
      );
    } else if (dialogType === 'delete') {
      return (
        <DeleteDialog 
          handleDialogType={handleDialogType}
          handleTriggerRefresh={handleTriggerRefresh}
        />
      );
    }
    return null;
  };

  const renderSelectAllIcon = () => {
    if (searchResults.length || (searchResults.length && viewMode === 'details')) {
      return (
        <div style={{ top: isSmallDevice ? '72px' : '88px' }} className="select-unselect-all-icon-container">
          <img 
            style={isSmallDevice ? { width: '24px' } : {}}
            onClick={handleSelectAll} 
            alt="select unselect all icon" 
            src={currentImages.length === searchResults.length ? UnselectAllIcon : SelectAllIcon} 
          />
        </div>
      );
    }
    return null;
  };

  const renderActions = () => {
    if (currentImages.length > 1 || (viewMode === 'thumbnail' && currentImages.length)) {
      return (
        <Actions 
          classes="action-buttons-container"
          style={{ top: isSmallDevice ? '100px' : '130px' }}
          fontSize={isSmallDevice ? 'medium' : 'large'}
          arts={currentImages}
          handleDialogType={handleDialogType}
        />
      );
    }
    return null;
  };
    
  return (
    <>
      <Message
        open={error.state}
        handleClose={clearNotifications}
        message={error.message}
        severity="error" />
      {renderDialog()}
      {renderSelectAllIcon()}
      {renderActions()}
      <div className="gallery-content-container">
        <SearchAndFiltersBar
          setPaginationDisabled={setPaginationDisabled}
          handleSearchResults={setSearchResults}
          triggerFetch={triggerFetch}
          page={page}
          viewMode={viewMode}
          handleViewMode={setViewMode}
        />
      </div>
      {!searchResults.length && <div className="no-data-container">Nothing was found!</div>}
      {renderViewMode()}
      {searchResults.length && !paginationDisabled ?
        <PaginationComponent 
          page={page}
          handlePage={handlePage}
        /> :
        null
      }
    </>
  );
};
export default GalleryContent;