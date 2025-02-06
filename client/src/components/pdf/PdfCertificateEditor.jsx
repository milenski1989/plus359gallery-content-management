import { TextField } from "@mui/material";
import EndAdornment from "./EndAdornment";
import LogoSelector from "./LogoSelector";
import CustomDropZone from "../upload/CustomDropZone";
import { handleOndrop } from "./helpers/utilityFunctions";

const multiValuesInputs = [
  {type: 'artists', placeholder: 'Artist'},
  {type: 'titles', placeholder: 'Title'},
  {type: 'techniques', placeholder: 'Technique'},
  {type: 'notes', placeholder: 'Notes'}
];

function PdfCertificateEditor({pdfData, updatePdfData, handleSwap, helperText, logoName, setLogoName}) {

  const { bio, website, email } = pdfData;

  const handleChangeInputField = (field, value, index = null) => {
    updatePdfData(field, value, index);
  };
  
  return (
    <>
      <div className="pdf-maker-editor-zone">
        <CustomDropZone
          handleOndrop={(acceptedFiles) => handleOndrop(acceptedFiles, updatePdfData, 'logo')}          acceptedFormats={{ 'image/jpeg': ['.jpeg', '.png'] }}
          isRequired={true}
          classes={['in-pdf']}
          customText="Drag and drop or select a file"
        />
        <LogoSelector 
          logoName={logoName} 
          setLogoName={setLogoName} 
          onLogoUpdate={(result) => updatePdfData('logo', result)} 
        />
        {multiValuesInputs.map(({type, placeholder}) => (
          <TextField
            key={type}
            label={placeholder}
            sx={{ width: '70%' }}
            onChange={(e) => handleChangeInputField(type, e.target.value, 1)}
            value={pdfData[type][1]}
            slotProps={{
              input: { endAdornment: <EndAdornment handleClick={() => handleSwap(type)} /> }
            }} />
        ))}
        <TextField
          id="long-text"
          multiline
          label="Bio"
          style={{ width: '70%' }}
          onChange={(e) => handleChangeInputField('bio', e.target.value)}
          value={bio}
          slotProps={{
            htmlInput: {
              maxLength: 2700
            }
          }}
          helperText={helperText} />
        <TextField
          label="Website"
          style={{ width: '70%' }}
          onChange={(e) => handleChangeInputField('website', e.target.value)}
          value={website}
        />
        <TextField
          label="Email"
          style={{ width: '70%' }}
          onChange={(e) => handleChangeInputField('email', e.target.value)}
          value={email}
        />
      </div>
    </>
  );
}

export default PdfCertificateEditor;