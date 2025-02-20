import { useCallback, useContext, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import { Dialog, DialogContent } from "@mui/material";
import { EntriesContext } from "../../contexts/EntriesContext";
import { downloadOriginalImages, generateBackGroundColor, prepareImagesForLocationChange } from "../../utils/helpers";
import './ListView.css';
import { handleEdit } from "../../utils/helpers";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useNavigate } from "react-router-dom";
import './MobileListView.css';
import ArtInfoContainer from "../details view/CardFooter";

const MobileListView = ({ searchResults, handleDialogType }) => {
  const { currentImages, setCurrentImages } = useContext(EntriesContext);
  const [selectedRow, setSelectedRow] = useState(null);

  const navigate = useNavigate();

  const openFullInfoDialog = (art) => {
    setSelectedRow(art);
    setCurrentImages([art]);
  };

  const truncateInfoProp = (propValue, length) => {
    if (propValue.length > length) {
      return `${propValue.slice(0, length)}...`;
    } else {
      return propValue;
    }
  };

  const handleLocationChange = (art) => {
    setCurrentImages([art]);
    prepareImagesForLocationChange(handleDialogType);
  };

  const handleCheckboxChange = useCallback((id) => {
    setCurrentImages((prevSelected) => {
      if (prevSelected.some((item) => item.id === id)) {
        return prevSelected.filter((image) => image.id !== id);
      } else {
        return [...prevSelected, searchResults.find((image) => image.id === id)];
      }
    });
  }, [setCurrentImages, searchResults]);

  return (
    <>
      <div className="mobile-header-container">
        <div>Position</div>
        <div style={{width: '70px'}}></div>
        <div className="info-text">
                                Artist
        </div>
        <div style={{width: '70px'}}> 
      
        </div>
      </div>
      <div className="mobile-rows">
        {searchResults.map((art, ind) => {
          const labelId = `checkbox-list-secondary-label-${ind}`;
          return (
            <div className="mobile-row-container" key={labelId}>
              <div
                className={`mobile-row-position-container ${art.position ? 'position-text' : ''}`}
                style={{backgroundColor: generateBackGroundColor(art.storage?.name || art.storage_name)}}>
                <Checkbox
                  onChange={() => handleCheckboxChange(art.id)}
                  checked={currentImages.some(image => image.id === art.id)}
                  sx={{
                    padding: 0,
                    color: 'white',
                    "&.Mui-checked": {
                      color: "white",
                    },
                  }}
                  icon={<RadioButtonUncheckedIcon />}
                  checkedIcon={<CheckCircleOutlineIcon />}
                />
                <p>{art.position ? art.position : ''}</p>
              </div>
              <img
                className="row-image"
                src={art.image_url}
                alt="list-item-image" />
              <div className="info-text">
                <p>{truncateInfoProp(art.artist, 10)}</p>
              </div>
              <div className="info-text">
                <p>{truncateInfoProp(art.dimensions, 10)}</p>
              </div>
              {currentImages.length === 1 && art.id === currentImages[0].id || !currentImages.length ? 
                <div className="mobile-row-actions">
                  <EditIcon 
                    fontSize="medium" 
                    onClick={() => handleEdit([art], navigate)}/>
                  <MoreHorizIcon
                    className="mobile-more-horizon-icon"
                    onClick={() => openFullInfoDialog(art)}
                  /> 
                </div>
                :
                null
              }
            </div>
          );
        })}
      </div>

      {selectedRow && (
        <Dialog open={Object.entries(selectedRow).length > 0} onClose={() => setSelectedRow(null)}>
          <DialogContent>
            <div className="mobile-full-info-dialog">
              <img
                src={selectedRow.image_url}
                alt="list-item-image" />
              <ArtInfoContainer art={selectedRow} />
              {currentImages.length === 1 ?
                <div className="row-actions"> 
                  <EditIcon 
                    fontSize="medium" 
                    onClick={() => handleEdit([selectedRow], navigate)}/>
                           
                  <>
                    <FileDownloadIcon fontSize="medium" onClick={() => downloadOriginalImages([selectedRow.download_key])}/>
                    <DeleteOutlineIcon
                      fontSize="medium"
                      onClick={() =>  handleDialogType('delete')} />
                    <DriveFileMoveIcon fontSize="medium" onClick={() => handleLocationChange(selectedRow)} />
                                 
                    <PictureAsPdfIcon fontSize="medium" onClick={() => navigate('/pdf')}/>
                  </>
                </div> 
                :
                null
              }
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default MobileListView;