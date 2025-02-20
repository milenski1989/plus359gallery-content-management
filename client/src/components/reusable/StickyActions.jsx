import { useContext } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CatalogueIcon from '@mui/icons-material/FormatListNumbered';
import { useNavigate } from 'react-router-dom';
import { downloadOriginalImages, handleEdit, prepareImagesForLocationChange } from '../utils/helpers';
import { EntriesContext } from '../contexts/EntriesContext';
import SelectAllIcon from '../../assets/select-all.svg';
import UnselectAllIcon from '../../assets/unselect-all.svg';
import { useMediaQuery } from '@mui/material';

import './StickyActions.css';

function StickyActions({classes, style = {}, arts, fontSize, handleDialogType, searchResults, viewMode}) {
  const navigate = useNavigate();
  let myStorage = window.localStorage;

  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  
  const {
    currentImages,
    setCurrentImages,
  } = useContext(EntriesContext);

  const hadleDelete = () => {
    setCurrentImages(arts);
    handleDialogType('delete');
  };

  const handleLocationChange = () => {
    setCurrentImages(arts);
    prepareImagesForLocationChange(handleDialogType);
  };

  const handleGoToCatalogue = () => {
    myStorage.setItem('currentImages', JSON.stringify(arts));
    window.localStorage.setItem('scrollPosition', JSON.stringify(window.scrollY));
    navigate('/pdf/catalogue');
  };

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

  return <>
    <div style={style} className={classes}>
      {renderSelectAllIcon()}
      {currentImages.length > 1 || (viewMode === 'thumbnail' && currentImages.length) ?
        <>
          <EditIcon fontSize={fontSize} onClick={() => handleEdit(arts, navigate)}/>
          <DriveFileMoveIcon fontSize={fontSize} onClick={handleLocationChange} />
          <DeleteOutlineIcon fontSize={fontSize} onClick={hadleDelete}/>
          <CatalogueIcon onClick={handleGoToCatalogue} fontSize={fontSize} />
          <FileDownloadIcon fontSize={fontSize} onClick={() => downloadOriginalImages(arts.map(art => art.download_key))} />
        </>
        :
        null
      }
    </div>
  </>;  
}

export default StickyActions;