import { useContext } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CatalogueIcon from '@mui/icons-material/FormatListNumbered';
import { useNavigate } from 'react-router-dom';
import { downloadOriginalImage, handleEdit, prepareImagesForLocationChange } from '../utils/helpers';
import { EntriesContext } from '../contexts/EntriesContext';

function VerticalActions({classes, style = {}, arts, fontSize, handleDialogType}) {
  const navigate = useNavigate();
  let myStorage = window.localStorage;

  const {
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

  const handleDownload = () => {
    downloadOriginalImage(arts.map(art => art.download_key));
    setCurrentImages([]);
  };

  return <>
    <div style={style} className={classes}>
      <> 
        <EditIcon fontSize={fontSize} onClick={() => handleEdit(arts, navigate)}/>
        <DriveFileMoveIcon fontSize={fontSize} onClick={handleLocationChange} />
        <DeleteOutlineIcon fontSize={fontSize} onClick={hadleDelete}/>
        <CatalogueIcon onClick={handleGoToCatalogue} fontSize={fontSize} />
        <FileDownloadIcon fontSize={fontSize} onClick={handleDownload} />
      </> 
    </div>
  </>;  
}

export default VerticalActions;