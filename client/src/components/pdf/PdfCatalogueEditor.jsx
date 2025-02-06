import { useState } from "react";
import { TextField, Button } from "@mui/material";
import LogoSelector from "./LogoSelector";
import { handleOndrop } from "./helpers/utilityFunctions";
import CustomDropZone from "../upload/CustomDropZone";

const textFields = [
  { name: "artist", placeholder: "Artist" },
  { name: "title", placeholder: "Title" },
  { name: "technique", placeholder: "Technique" },
  { name: "dimensions", placeholder: "Dimensions" },
];

function PdfCatalogueEditor({ pdfDataList, setPdfDataList, setLogo, website, setWebsite, logoName, setLogoName }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentData = pdfDataList[currentIndex];
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedDataList = [...pdfDataList];
    updatedDataList[currentIndex] = { ...updatedDataList[currentIndex], [name]: value };
    setPdfDataList(updatedDataList);
  };

  return (
    <div className="pdf-maker-editor-zone">
      <CustomDropZone
        handleOndrop={(acceptedFiles) => handleOndrop(acceptedFiles, setLogo,null, setLogoName)}          
        acceptedFormats={{ 'image/jpeg': ['.jpeg', '.png'] }}
        isRequired={true}
        classes={['in-pdf']}
        customText="Drag and drop or select a file"
      />
      <LogoSelector
        logoName={logoName} 
        setLogoName={setLogoName} 
        onLogoUpdate={setLogo} 
      />
      {textFields.map(({ name, placeholder }) => (
        <TextField
          key={name}
          name={name}
          label={placeholder}
          sx={{ width: "70%" }}
          onChange={handleInputChange}
          value={currentData?.[name] || ""}
        />
      ))}
      <TextField
        label="Website"
        name="website"
        sx={{ width: "70%" }}
        onChange={(e) => setWebsite(e.target.value)}
        value={website || ""}
      />
      
      <div className="pdf-editor-navigation">
        <Button
          onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
          disabled={currentIndex === 0}
        >
          Previous
        </Button>
        <span>Page {currentIndex + 1} of {pdfDataList.length}</span>
        <Button
          onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, pdfDataList.length - 1))}
          disabled={currentIndex === pdfDataList.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default PdfCatalogueEditor;