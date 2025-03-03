import { useContext } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CertificateIcon from '@mui/icons-material/WorkspacePremium';
import { useNavigate } from 'react-router-dom';
import { downloadOriginalImage, handleEdit, prepareImagesForLocationChange } from '../utils/helpers';
import { EntriesContext } from '../contexts/EntriesContext';

function Actions({classes, style = {}, artwork, fontSize, handleDialogType}) {
  const navigate = useNavigate();

  const {
    setCurrentImages
  } = useContext(EntriesContext);

  const hadleDelete = () => {
    setCurrentImages([artwork]);
    handleDialogType('delete');
    window.localStorage.setItem('scrollPosition', JSON.stringify(window.scrollY));
  };

  const handleLocationChange = () => {
    setCurrentImages([artwork]);
    prepareImagesForLocationChange(handleDialogType);
    window.localStorage.setItem('scrollPosition', JSON.stringify(window.scrollY));
  };

  const handleGoToCertificate = () => {
    window.localStorage.setItem('currentImages', JSON.stringify([artwork]));
    window.localStorage.setItem('scrollPosition', JSON.stringify(window.scrollY));
    navigate('/pdf/certificate');
  };

  const handleGoToEditPage = () => {
    window.localStorage.setItem('scrollPosition', JSON.stringify(window.scrollY));
    handleEdit([artwork], navigate);
  };

  return <>
    <div style={style} className={classes}>
      <> 
        <EditIcon fontSize={fontSize} onClick={handleGoToEditPage}/>
        <DriveFileMoveIcon fontSize={fontSize} onClick={handleLocationChange} />
        <DeleteOutlineIcon fontSize={fontSize} onClick={hadleDelete}/>
        <CertificateIcon onClick={handleGoToCertificate} fontSize={fontSize} />
        <FileDownloadIcon fontSize={fontSize} onClick={() => downloadOriginalImage([artwork.download_key])} />
      </> 
    </div>
  </>;  
}

export default Actions;