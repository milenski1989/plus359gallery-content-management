import { useContext } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CertificateIcon from '@mui/icons-material/WorkspacePremium';
import { useNavigate } from 'react-router-dom';
import { downloadOriginalImages, handleEdit, prepareImagesForLocationChange } from '../utils/helpers';
import { EntriesContext } from '../contexts/EntriesContext';

function Actions({classes, style = {}, arts, fontSize, handleDialogType}) {
  const navigate = useNavigate();

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

  const handleGoToCertificate = () => {
    window.localStorage.setItem('currentImages', JSON.stringify(arts));
    window.localStorage.setItem('scrollPosition', JSON.stringify(window.scrollY));
    navigate('/pdf/certificate');
  };

  return <>
    <div style={style} className={classes}>
      <> 
        <EditIcon fontSize={fontSize} onClick={() => handleEdit(arts, navigate)}/>
        <DriveFileMoveIcon fontSize={fontSize} onClick={handleLocationChange} />
        <DeleteOutlineIcon fontSize={fontSize} onClick={hadleDelete}/>
        <CertificateIcon onClick={handleGoToCertificate} fontSize={fontSize} />
        <FileDownloadIcon fontSize={fontSize} onClick={() => downloadOriginalImages(arts.map(art => art.download_key))} />
      </> 
    </div>
  </>;  
}

export default Actions;