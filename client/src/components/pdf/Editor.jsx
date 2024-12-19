import { TextField } from "@mui/material";
import CustomDropZone from "../upload/CustomDropZone";
import EndAdornment from "./EndAdornment";

const multiValuesInputs = [
  {type: 'artists', placeholder: 'Artist'},
  {type: 'titles', placeholder: 'Title'},
  {type: 'techniques', placeholder: 'Technique'},
  {type: 'notes', placeholder: 'Notes'}
]

function Editor({pdfData, updatePdfData, handleSwap, helperText}) {

  const { bio, website, email } = pdfData;

  const handleSelectLogo = (files) => {
    getBase64string(files[0], (result) => {
      updatePdfData('logo', result);
    });
  };

  const handleChangeInputField = (field, value, index = null) => {
    updatePdfData(field, value, index);
  };

  function getBase64string(file, callBack) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      callBack(reader.result)
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  return (
    <div className="pdf-maker-editor-zone">
      <CustomDropZone
        handleOndrop={handleSelectLogo}
        acceptedFormats={{ 'image/jpeg': ['.jpeg', '.png'] }}
        classes={['in-pdf-maker']}
        customText="Choose or drop a logo" />
      {multiValuesInputs.map(({type, placeholder}) => (
        <TextField
          key={type}
          placeholder={placeholder}
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
        placeholder="Bio"
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
        placeholder="Website"
        style={{ width: '70%' }}
        onChange={(e) => handleChangeInputField('website', e.target.value)}
        value={website}
      />
      <TextField
        placeholder="Email"
        style={{ width: '70%' }}
        onChange={(e) => handleChangeInputField('email', e.target.value)}
        value={email}
      />
    </div>
  )
}

export default Editor