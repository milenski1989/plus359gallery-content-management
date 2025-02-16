import LogoSelector from "./LogoSelector";
import { handleOndrop } from "./helpers/utilityFunctions";
import CustomDropZone from "../upload/CustomDropZone";
import { useMediaQuery } from "@mui/material";

function UploadLogo({setLogo}) {

  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const dropZoneClasses = isSmallDevice ? ['in-mobile-pdf'] : ['in-pdf'];

  return (
    <>
      <CustomDropZone
        handleOndrop={(acceptedFiles) => handleOndrop(acceptedFiles, setLogo)}          
        acceptedFormats={{ 'image/jpeg': ['.jpeg', '.png'] }}
        isRequired={true}
        classes={dropZoneClasses}
        customText="Drag and drop or select a file"
      />
      <LogoSelector
        onLogoUpdate={setLogo} 
      />
    </>
  );
}

export default UploadLogo;