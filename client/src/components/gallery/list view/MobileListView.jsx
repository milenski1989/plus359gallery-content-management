import { useContext, useState } from "react";
import { EntriesContext } from "../../contexts/EntriesContext";
import { generateBackGroundColor } from "../../utils/helpers";
import './ListView.css';
import { handleEdit } from "../../utils/helpers";
import EditIcon from '@mui/icons-material/Edit';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ShowMoreIcon from '@mui/icons-material/MoreHoriz';
import { useNavigate } from "react-router-dom";
import './MobileListView.css';
import CustomCheckbox from "../CustomCheckbox";
import ListViewDialog from "./ListViewDialog";

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
                <CustomCheckbox
                  searchResults={searchResults} 
                  id={art.id}
                  sx={{
                    color: "white",
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
                  <ShowMoreIcon
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
      {selectedRow && <ListViewDialog selectedRow={selectedRow} setSelectedRow={setSelectedRow} handleDialogType={handleDialogType}/>}
    </>
  );
};

export default MobileListView;