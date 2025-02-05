import { useContext, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useNavigate } from 'react-router-dom';
import { downloadOriginalImages, handleEdit, prepareImagesForLocationChange } from '../utils/helpers';
import { EntriesContext } from '../contexts/EntriesContext';
import { Menu, MenuItem } from '@mui/material';

function Actions({classes, style = {}, arts, fontSize, handleDialogType}) {
  const navigate = useNavigate()
  let myStorage = window.localStorage;
  const [anchorEl, setAnchorEl] = useState(null);
  const [isPdfActionsMenuOpen, setIsPdfActionsMenuOpen] = useState(false);
  const {
    currentImages,
    setCurrentImages,
  } = useContext(EntriesContext);

  const hadleDelete = () => {
    setCurrentImages(arts)
    handleDialogType('delete')
  }

  const handleLocationChange = () => {
    setCurrentImages(arts)
    prepareImagesForLocationChange(handleDialogType)
  }

  const handlePdfButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
    setIsPdfActionsMenuOpen(true);
    myStorage.setItem('currentImages', JSON.stringify(arts));
  };

  return <>
    <div style={style} className={classes}>
      <> 
        <EditIcon fontSize={fontSize} onClick={() => handleEdit(arts, navigate)}/>
        <DriveFileMoveIcon fontSize={fontSize} onClick={handleLocationChange} />
        <DeleteOutlineIcon fontSize={fontSize} onClick={hadleDelete}/>
        <PictureAsPdfIcon onClick={handlePdfButtonClick} fontSize={fontSize}  />
        <Menu
          anchorEl={anchorEl}
          open={isPdfActionsMenuOpen}
          onClose={() => setIsPdfActionsMenuOpen(false)}
        >
          {currentImages.length === 1 ? <MenuItem onClick={() => navigate('/pdf/certificate')}>Certificate</MenuItem> : null}
          <MenuItem onClick={() => navigate('/pdf/catalogue')}>Catalogue</MenuItem>
        </Menu>
        
        <FileDownloadIcon fontSize={fontSize} onClick={() => downloadOriginalImages(arts.map(art => art.download_key))} />
      </> 
    </div>
  </>  
}

export default Actions