import { useCallback, useContext, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import { EntriesContext } from "../contexts/EntriesContext";
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import { Dialog, DialogContent } from "@mui/material";
import { downloadOriginalImages, generateBackGroundColor, handleEdit } from "../utils/helpers";
import ArtInfoContainer from "./details view/CardFooter";
import { useNavigate } from "react-router-dom";
import Actions from "../reusable/Actions";

import './ListView.css';

const ListView = ({ searchResults, handleDialogType }) => {
  const { currentImages, setCurrentImages } = useContext(EntriesContext);

  const [selectedRow, setSelectedRow] = useState(null);

  const navigate = useNavigate();

  const truncateInfoProp = (propValue, length) => {
    if (!propValue) return '';
    if (propValue.length > length) {
      return `${propValue.slice(0, length)}...`;
    } else {
      return propValue;
    }
  };

  const prepareImagesForLocationChange = (art) => {
    setCurrentImages([art]);
    handleDialogType('location');
  };

  const openFullInfoDialog = (art) => {
    setSelectedRow(art);
    setCurrentImages([art]);
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
      <div className="header-container">
        <div>Position</div>
        <div style={{width: '70px'}}></div>
        <div className="info-text">
                                Artist
        </div>
        <div className="info-text">
                               Dimensions
        </div>
        <div className="info-text">
                                Technique
        </div>
        <div className="info-text">
                               Cell
        </div>
        <div className="row-actions"> 
                          Actions
        </div>
      </div>
      <div className="rows">
        {searchResults.map((art, ind) => {
          const labelId = `checkbox-list-secondary-label-${ind}`;
          return (
            <div className="row-container" key={labelId}>
              <div
                className={`row-position-container ${art.position ? 'position-text' : ''}`}
                style={{backgroundColor: generateBackGroundColor(art.storage?.name || art.storage_name)}}>
                <p>{art.position ? art.position : ''}</p>
              </div>
              <img
                className="row-image"
                src={art.image_url}
                alt="list-item-image" />
              <div className="info-text">
                <p>{truncateInfoProp(art.artist, 25)}</p>
              </div>
              <div className="info-text">
                <p>{truncateInfoProp(art.dimensions, 25)}</p>
              </div>
              <div className="info-text">
                <p>{truncateInfoProp(art.technique, 25)}</p>
              </div>
              <div className="info-text">
                <p>{truncateInfoProp(art.cell, 25)}</p>
              </div>
              <Checkbox
                onChange={() => handleCheckboxChange(art.id)}
                checked={currentImages.some(image => image.id === art.id)}
                sx={{
                  padding: 0,
                  color: 'black',
                  "&.Mui-checked": {
                    color: "black",
                  },
                }}
                icon={<RadioButtonUncheckedIcon />}
                checkedIcon={<CheckCircleOutlineIcon />} />
              <Actions 
                classes="row-actions"
                fontSize="medium"
                arts={[art]}
                handleDialogType={handleDialogType}
              />
              <MoreHorizIcon className="more-horizon-icon" fontSize="medium" onClick={() =>  openFullInfoDialog(art)} />
            </div>
          );
        })}
      </div>

      {selectedRow && (
        <Dialog open={selectedRow} onClose={() => setSelectedRow(null)}>
          <DialogContent>
            <div className="full-info-dialog">
              <img
                src={selectedRow.image_url}
                alt="list-item-image" />
              <ArtInfoContainer art={selectedRow} />
              {currentImages.length === 1 ?
                <div className="row-actions"> 
                  <EditIcon 
                    fontSize="medium" 
                    onClick={() => handleEdit([selectedRow], setCurrentImages, navigate)}/>
                  <>
                    <FileDownloadIcon fontSize="medium" onClick={() => downloadOriginalImages(currentImages.map(image => image.download_key))}/>
                    <DeleteOutlineIcon
                      fontSize="medium"
                      onClick={() => {
                        handleDialogType('delete');
                      }} />
                    <DriveFileMoveIcon fontSize="medium" onClick={() => prepareImagesForLocationChange(selectedRow)} />
                                 
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

export default ListView;