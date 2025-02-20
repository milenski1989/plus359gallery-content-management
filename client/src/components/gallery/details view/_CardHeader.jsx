import { useCallback, useContext } from "react";
import { generateBackGroundColor } from "../../utils/helpers";
import { EntriesContext } from "../../contexts/EntriesContext";
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Checkbox } from "@mui/material";

import './_CardHeader.css';

function CardHeader({searchResults, art}) {

  const {
    currentImages,
    setCurrentImages,
  } = useContext(EntriesContext);

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
    <div className="card-header">
      <p className="header">{art.artist || 'No Artist'}</p>
      {art.position ? (
        <div
          className="card-position"
          style={{backgroundColor: generateBackGroundColor(art.storage?.name || art.storage_name)}}>
          <p>{art.position}</p>
        </div>
      ) : null}
      <Checkbox
        onChange={() => handleCheckboxChange(art.id)}
        checked={currentImages.some(image => image.id === art.id)}
        icon={<RadioButtonUncheckedIcon />}
        checkedIcon={<CheckCircleOutlineIcon />}
      />
    </div>
  );
}

export default CardHeader;