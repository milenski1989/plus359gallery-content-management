import { useCallback, useContext } from 'react';
import { EntriesContext } from '../contexts/EntriesContext';
import { Checkbox } from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import './Thumbnail.css';
import { useLoadedImages } from '../hooks/useLoadedImages';

const Thumbnail = ({artwork, searchResults}) => {
  const [allImagesLoaded] = useLoadedImages(searchResults);

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

  return <>
    <div
      key={artwork.id}>
      <Checkbox
        onChange={() => handleCheckboxChange(artwork.id)}
        checked={currentImages.some(image => image.id === artwork.id)}
        sx={{
          position: "absolute",
          zIndex: '888',
          color: "white",
          "&.Mui-checked": {
            color: "white",
          },
        }}
        icon={<RadioButtonUncheckedIcon />}
        checkedIcon={<CheckCircleOutlineIcon />}
      />
      <div 
        className="image-container">
        {allImagesLoaded &&
                    <img 
                      src={artwork.image_url} 
                      alt="image" 
                    />
        }
      </div>
    </div>
        
  </>;   
};

export default Thumbnail;