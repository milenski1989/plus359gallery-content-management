import { useState } from "react";
import "../Upload.css";
import { Button, TextField } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Message from "../../reusable/Message";
import { uploadDocWithData } from "../../../api/s3Service";
import CustomDropZone from "../CustomDropZone";
import useNotification from "../../hooks/useNotification";
import { CircularProgressWithLabel } from "../Upload";

const UploadDocs = () => {
  let myStorage = window.localStorage;
  let user = JSON.parse(myStorage.getItem('user'));

  const [docs, setDocs] = useState([]);
  const [progress, setProgress] = useState(0);
  const { success, error, showSuccess, showError, clearNotifications, isLoading, startLoading, stopLoading } = useNotification();

  const handleOnDrop = (files) => {
    const newEntries = files.map((file) => ({
      file,
      //preview: URL.createObjectURL(file),
      inputsData: {
        title: "",
        notes: ""
      }
    }));
    setDocs((prev) => [...prev, ...newEntries]);
  };

  const handleInputChange = (index, key, event) => {
    const _artworks = [...docs];
    _artworks[index].inputsData[key] = event.target.value;
    setDocs(_artworks);
  };

  const handleSubmit = async () => {
    try {
      startLoading();
      for (const artwork of docs) {
        const data = new FormData();
        data.append("file", artwork.file);
        Object.entries(artwork.inputsData).forEach(([key, value]) => data.append(key, value));
        data.append("by_user", user.userName);

        await uploadDocWithData(data, (event) => {
          const percentage = Math.round((100 * event.loaded) / event.total);
          setProgress(percentage);
        });
      }

      stopLoading();
      showSuccess('Entries uploaded successfully');
      setDocs([]);
    } catch (error) {
      setProgress(0);
      stopLoading();
      showError(error.response.data.error);
    }
  };

  const isUploadButtonDisabled = () => {
    return docs.some(doc => !doc.file || !doc.inputsData.title) || !docs.length;
  };

  return (
    <div className="upload-main-section">
      <Message
        open={error.state}
        handleClose={clearNotifications}
        message={error.message}
        severity="error"
      />

      <Message
        open={success.state}
        handleClose={clearNotifications}
        message={success.message}
        severity="success"
      />

      {isLoading && <CircularProgressWithLabel variant="determinate" value={progress} color="primary" />}
      {!isLoading && (
        <>
          <CustomDropZone
            handleOndrop={handleOnDrop}
            isRequired={true}
            classes={['in-upload']}
            customText="Drag and drop or select files"
          />
          {docs.map((doc, index) => (
            <div key={index} className="upload-section">
              <div className="upload-filezone">
                <span className={doc.file ? 'upload-file-attached' : 'upload-file-not-attached'}></span>
                <span>{doc.file ? `${doc.file.name.slice(0, 24)}...` : 'Please attach a file!'}</span>
                {/* {doc.file && (
                  <img
                    src={DeleteIcon}
                    className='icon'
                    onClick={() => {
                      const _artworks = docs.filter((_, i) => i !== index);
                      URL.revokeObjectURL(doc.preview); 
                      setDocs(_artworks);
                    }}
                  />
                )} */}
                <DeleteOutlineIcon
                  onClick={() => {
                    const _docs = docs.filter((_, i) => i !== index);
                    setDocs(_docs);
                  }}
                />
              </div>
              {/* {doc.file && (
                <img
                  src={doc?.preview}
                  alt="Image preview"
                  className="image-preview"
                />
              )} */}
              {Object.entries(doc.inputsData).map(([key, value]) => (
                <TextField
                  key={key}
                  label={key}
                  className="upload-textfield"
                  value={value}
                  onChange={(event) => handleInputChange(index, key, event)}
                  required={key === 'technique' || key === 'title'}
                />
              ))}
            </div>
          ))}
          <Button
            onClick={handleSubmit}
            sx={{ mt: 2 }}
            type="submit"
            variant="contained"
            disabled={isUploadButtonDisabled()}
          >
                Submit
          </Button>
        </>
      )}
    </div>
  );
};

export default UploadDocs;
