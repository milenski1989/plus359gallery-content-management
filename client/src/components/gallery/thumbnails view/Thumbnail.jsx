import './Thumbnail.css';
import { useLoadedImages } from '../../hooks/useLoadedImages';
import CustomCheckbox from '../CustomCheckbox';

const Thumbnail = ({artwork, searchResults}) => {

  const [allImagesLoaded] = useLoadedImages(searchResults);

  return <>
    <div
      key={artwork.id}>
      <CustomCheckbox 
        searchResults={searchResults} 
        id={artwork.id}
        sx={{
          position: "absolute",
          zIndex: '888',
          color: "white",
          "&.Mui-checked": {
            color: "white",
          },
        }}
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