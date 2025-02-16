import { TextField, useMediaQuery } from "@mui/material";
import EndAdornment from "./EndAdornment";
import UploadLogo from './UploadLogo';

const multiValuesInputs = [
  {type: 'artists', placeholder: 'Artist'},
  {type: 'titles', placeholder: 'Title'},
  {type: 'techniques', placeholder: 'Technique'},
  {type: 'notes', placeholder: 'Notes'}
];

function PdfCertificateEditor({pdfData, updatePdfData, handleSwap, helperText, setLogo}) {

  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const sx = {width: isSmallDevice ? '80vw' : '70%'};
  const { bio, website, email } = pdfData;

  const handleChangeInputField = (field, value, index = null) => {
    updatePdfData(field, value, index);
  };
  
  return (
    <>
      <div className={`pdf-maker-editor-zone ${isSmallDevice ? 'in-mobile' : ''}`}>
        <UploadLogo setLogo={setLogo}/>
        {multiValuesInputs.map(({type, placeholder}) => (
          <TextField
            key={type}
            label={placeholder}
            sx={sx}
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