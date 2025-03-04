import { useState } from "react";

import './CardImage.css';

function CardImage({imageUrl}) {

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    setDimensions({ width: naturalWidth, height: naturalHeight });
    setImageLoaded(true);
  };
  
  return (
    <>
      <div className="card-image-container" style={{
        height: imageLoaded ? 'auto' : `${(dimensions.height / dimensions.width) * 100}%`,
      }}>
        {!imageLoaded && <div className="card-image-placeholder"></div>}
        <img
          className="card-image"
          src={imageUrl}
          alt="image"
          onLoad={handleImageLoad}
          style={{
            display: imageLoaded ? 'block' : 'none',
          }}
        />
      </div>
    </>
  );
}

export default CardImage;