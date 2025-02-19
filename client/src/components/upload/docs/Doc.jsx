import { Checkbox, useMediaQuery } from "@mui/material";
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useCallback } from "react";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import '../../gallery/Card.css';
import { downloadOriginalImages } from "../../utils/helpers";

const Doc = ({doc, docs, selectedDocs, setSelectedDocs}) => {

  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  const handleCheckboxChange = useCallback((id) => {
    setSelectedDocs((prevSelected) => {
      if (prevSelected.some((item) => item.id === id)) {
        return prevSelected.filter((doc) => doc.id !== id);
      } else {
        return [...prevSelected, docs.find((image) => image.id === id)];
      }
    });
  }, [setSelectedDocs, docs]);

  return (
    <div className="card" key={doc.id}>
      <div className="card-header-container">
        <Checkbox
          onChange={() => handleCheckboxChange(doc.id)}
          checked={selectedDocs.some(image => image.id === doc.id)}
          sx={{
            "&.Mui-checked": {
              color: "black",
            },
          }}
          icon={<RadioButtonUncheckedIcon />}
          checkedIcon={<CheckCircleOutlineIcon />}
        />
      </div>
      <div>
        <p>{doc.title}</p>
        <p>{doc.notes}</p>
      </div>
      <>
        <div className={isSmallDevice ? "mobile-card-actions": "card-actions"}>
          <> 
            <DeleteOutlineIcon onClick={() => {}}/>
            <FileDownloadIcon onClick={() => downloadOriginalImages(docs.map(doc => doc.download_key))} />
          </> 
        </div>
      </>
    </div>
  );
};

export default Doc;