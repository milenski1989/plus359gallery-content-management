import { useState } from "react";
import { TextField, useMediaQuery } from "@mui/material";
import ArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import ArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import UploadLogo from './UploadLogo';

const textFields = [
  { name: "artist", placeholder: "Artist" },
  { name: "title", placeholder: "Title" },
  { name: "technique", placeholder: "Technique" },
  { name: "dimensions", placeholder: "Dimensions" },
];

function PdfCatalogueEditor({ pdfDataList, setPdfDataList, setLogo, website, setWebsite, selectedImages = null}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentData = pdfDataList[currentIndex];
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const sx = {width: isSmallDevice ? '80vw' : '70%'};

  const renderImagesPreview = () => {
    if (!selectedImages || selectedImages.length === 0) return null;
  
    return (
      <div className="image-preview-container">
        <img
          src={selectedImages[currentIndex]?.image_url}
          alt={`Preview ${currentIndex + 1}`}
          className="image-preview"
        />
      </div>
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedDataList = [...pdfDataList];
    updatedDataList[currentIndex] = { ...updatedDataList[currentIndex], [name]: value };
    setPdfDataList(updatedDataList);
  };

  return (
    <div className={`pdf-maker-editor-zone ${isSmallDevice ? 'in-mobile' : ''}`}>
      {isSmallDevice && selectedImages && renderImagesPreview()}
      <UploadLogo setLogo={setLogo} />
      {textFields.map(({ name, placeholder }) => (
        <TextField
          key={name}
          name={name}
          label={placeholder}
          sx={sx}
          onChange={handleInputChange}
          value={currentData?.[name] || ""}
        />
      ))}
  
      <TextField
        label="Website"
        name="website"
        sx={sx}
        onChange={(e) => setWebsite(e.target.value)}
        value={website || ""}
      />
  
      <div className="pdf-editor-navigation">
        <div className="arrow-container">
          {currentIndex !== 0 &&  
            <ArrowLeftIcon onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}/>
          }
        </div>
        <span>Page {currentIndex + 1} of {pdfDataList.length}</span>
        <div className="arrow-container">
          {currentIndex !== pdfDataList.length - 1 &&
            <ArrowRightIcon onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, pdfDataList.length - 1))}/>
          }
        </div>
      </div>
    </div>
  );
  
}

export default PdfCatalogueEditor;