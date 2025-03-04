import { useCallback, useContext, useEffect } from "react";
import LocationChangeDialog from "../LocationChangeDialog";
import DeleteDialog from "../reusable/DeleteDialog";
import { EntriesContext } from "../contexts/EntriesContext";
import { useMediaQuery } from "@mui/material";
import useNotification from "../hooks/useNotification";
import Message from "../reusable/Message";
import StickyActions from '../reusable/StickyActions';

import './GalleryContent.css';

function GalleryContent({
  searchResults, 
  dialogType, 
  setDialogType, 
  viewMode, 
  setTriggeredFetchArtworks,
}) {

  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const { error, clearNotifications } = useNotification();

  const {
    currentImages
  } = useContext(EntriesContext);

  useEffect(() => {
    const scrollPosition = window.localStorage.getItem('scrollPosition');

    setTimeout(() => {
      if (scrollPosition) {
        window.scrollTo(0, scrollPosition, 'smooth');
        window.localStorage.removeItem('scrollPosition');
      }
    }, 100);
    
  },[]);

  const renderDialog = () => {
    if (dialogType === 'location') {
      return (
        <LocationChangeDialog 
          handleDialogType={handleDialogType}
          handleTriggerRefresh={setTriggeredFetchArtworks}
        />
      );
    } else if (dialogType === 'delete') {
      return (
        <DeleteDialog 
          handleDialogType={handleDialogType}
          handleTriggerRefresh={setTriggeredFetchArtworks}
        />
      );
    }
    return null;
  };
    
  const handleDialogType = useCallback((type) => setDialogType(type), []);

  return (
    <>
      <Message
        open={error.state}
        handleClose={clearNotifications}
        message={error.message}
        severity="error" />
      {renderDialog()}
      <StickyActions
        classes="sticky-actions-container"
        style={{ top: isSmallDevice ? '100px' : '130px' }}
        fontSize={isSmallDevice ? 'medium' : 'large'}
        arts={currentImages}
        handleDialogType={handleDialogType}
        searchResults={searchResults}
        viewMode={viewMode}
      />
    </>
  );
}

export default GalleryContent;