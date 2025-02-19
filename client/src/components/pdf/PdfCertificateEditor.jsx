import { TextField, useMediaQuery } from "@mui/material";
import EndAdornment from "./EndAdornment";
import UploadLogo from './UploadLogo';

const multiValuesInputs = [
  {type: 'artists', placeholder: 'Artist'},
  {type: 'titles', placeholder: 'Title'},
  {type: 'techniques', placeholder: 'Technique'},
  {type: 'dimensions', placeholder: 'Dimensions'}
];

function PdfCertificateEditor({pdfData, updatePdfData, handleSwap, helperText, setLogo, selectedImage = null}) {

  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const sx = {width: isSmallDevice ? '80vw' : '70%'};
  const { bio, website, email } = pdfData;

  const renderImagesPreview = () => {
    if (!selectedImage) return null;
  
    return (
      <div className="image-preview-container">
        <img
          src={selectedImage?.image_url}
          alt="preview image"
          className="image-preview"
        />
      </div>
    );
  };

  const handleChangeInputField = (field, value, index = null) => {
    if (field === 'dimensions')  updatePdfData(field, value, index);
    else updatePdfData(field, value, index);
  };
  
  return (
    <>
      <div className={`pdf-maker-editor-zone ${isSmallDevice ? 'in-mobile' : ''}`}>
        {isSmallDevice && selectedImage && renderImagesPreview()}
        <UploadLogo setLogo={setLogo}/>
        {multiValuesInputs.map(({type, placeholder}) => (
          <TextField
            key={type}
            label={placeholder}
            sx={sx}
            onChange={(e) => handleChangeInputField(type, e.target.value, 0)}
            value={type === 'dimensions' ? pdfData[type] : pdfData[type][0]}
            slotProps={type !== 'dimensions' ? 
              {input: { endAdornment: <EndAdornment handleClick={() => handleSwap(type)} /> }}
              :
              null
            }/>
        ))}
        <TextField
          id="long-text"
          multiline
          label="Bio"
          sx={sx}
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
          sx={sx}
          onChange={(e) => handleChangeInputField('website', e.target.value)}
          value={website}
        />
        <TextField
          label="Email"
          sx={sx}
          onChange={(e) => handleChangeInputField('email', e.target.value)}
          value={email}
        />
      </div>
    </>
  );
}

export default PdfCertificateEditor;