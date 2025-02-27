import { Checkbox, useMediaQuery } from "@mui/material";
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { generateBackGroundColor } from "../utils/helpers";
import { useCallback, useContext, useState } from "react";
import { EntriesContext } from "../contexts/EntriesContext";
import './Card.css';
import ArtInfoContainer from "./ArtInfoContainer";
import Actions from "../reusable/Actions";


const Card = ({handleDialogType, searchResults, art}) => {

  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");


  const {
    currentImages,
    setCurrentImages,
  } = useContext(EntriesContext);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    setDimensions({ width: naturalWidth, height: naturalHeight });
    setImageLoaded(true);
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
    <div className="card" key={art.id}>
      <div className="card-header-container">
        <p className="card-header">{art.artist || 'No Artist'}</p>
        {art.position !== 0 ? (
          <div
            className="card-position-container"
            style={{backgroundColor: generateBackGroundColor(art.storage?.name || art.storage_name)}}>
            <p style={{ padding: "0.7rem" }}>{art.position}</p>
          </div>
        ) : null}
        <Checkbox
          onChange={() => handleCheckboxChange(art.id)}
          checked={currentImages.length && currentImages.some(image => image.id === art.id)}
          sx={{
            "&.Mui-checked": {
              color: "black",
            },
          }}
          icon={<RadioButtonUncheckedIcon />}
          checkedIcon={<CheckCircleOutlineIcon />}
        />
      </div>
      <div className="card-image-container" style={{
        height: imageLoaded ? 'auto' : `${(dimensions.height / dimensions.width) * 100}%`,
      }}>
        {!imageLoaded && 
                    <div className="card-image-placeholder"></div>
        }
        <img
          className="card-image"
          src={art.image_url}
          alt="image"
          onLoad={handleImageLoad}
          style={{
            display: imageLoaded ? 'block' : 'none',
          }}
        />
      </div>
      {!imageLoaded && 
                <div className="card-image-placeholder"></div>
      }
      <>
        <Actions 
          classes={isSmallDevice ? "mobile-card-actions": "card-actions"}
          fontSize="medium"
          artwork={art}
          handleDialogType={handleDialogType}
        />
        <ArtInfoContainer art={art} />
      </>
    </div>
  );
};

export default Card;