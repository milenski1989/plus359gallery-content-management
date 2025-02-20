import { Checkbox } from "@mui/material";
import { useCallback, useContext } from "react";
import { EntriesContext } from "../contexts/EntriesContext";
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

function CustomCheckbox({searchResults, id, sx = {}}) {

  const { currentImages, setCurrentImages } = useContext(EntriesContext);

  const handleCheckboxChange = useCallback((id) => {
    setCurrentImages((prevSelected) => {
      if (prevSelected.some((item) => item.id === id)) {
        return prevSelected.filter((image) => image.id !== id);
      } else {
        return [...prevSelected, searchResults.find((image) => image.id === id)];
      }
    });
  }, [setCurrentImages, searchResults]);

  return (
    <>
      <Checkbox
        sx={sx}
        onChange={() => handleCheckboxChange(id)}
        checked={currentImages.some(image => image.id === id)}
        icon={<RadioButtonUncheckedIcon />}
        checkedIcon={<CheckCircleOutlineIcon />} 
      />
    </>
  );
}

export default CustomCheckbox;