import { useContext } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CatalogueIcon from '@mui/icons-material/FormatListNumbered';
import CertificateIcon from '@mui/icons-material/WorkspacePremium';
import { useNavigate } from 'react-router-dom';
import { downloadOriginalImages, handleEdit, prepareImagesForLocationChange } from '../utils/helpers';
import { EntriesContext } from '../contexts/EntriesContext';

function VerticalActions({classes, style = {}, arts, fontSize, handleDialogType}) {
  const navigate = useNavigate();
  let myStorage = window.localStorage;

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

  const handleGoToCertificate = () => {
    myStorage.setItem('currentImages', JSON.stringify(arts));
    navigate('/pdf/certificate');
  };

  const handleGoToCatalogue = () => {
    myStorage.setItem('currentImages', JSON.stringify(arts));
    myStorage.setItem('scrollPosition', window.scrollY);
    navigate('/pdf/catalogue');
  };

  return <>
    <div style={style} className={classes}>
      <> 
        <EditIcon fontSize={fontSize} onClick={() => handleEdit(arts, navigate)}/>
        <DriveFileMoveIcon fontSize={fontSize} onClick={handleLocationChange} />
        <DeleteOutlineIcon fontSize={fontSize} onClick={hadleDelete}/>
        {currentImages.length > 1 ?
          <CatalogueIcon onClick={handleGoToCatalogue} fontSize={fontSize} />
          :
          <CertificateIcon onClick={handleGoToCertificate} fontSize={fontSize} />
        }
        <FileDownloadIcon fontSize={fontSize} onClick={() => downloadOriginalImages(arts.map(art => art.download_key))} />
      </> 
    </div>
  </>;  
}

export default VerticalActions;