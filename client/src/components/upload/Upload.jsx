import { useEffect, useState } from "react";
import "./Upload.css";
import { Autocomplete, Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import Message from "../reusable/Message";
import CascadingDropdowns from "../reusable/CascadingDropdowns";
import { uploadImageWithData } from "../../api/s3Service";
import { getArtistsInStorage } from "../../api/artistsService";
import CustomDropZone from "./CustomDropZone";
import DeleteIcon from '../../assets/delete-solid.svg';
import useNotification from "../hooks/useNotification";

export function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          right: 0,    
          left: 0,
          bottom: 0,                
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{ color: 'text.secondary' }}
        >
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

const Upload = () => {
  let myStorage = window.localStorage;
  let user = JSON.parse(myStorage.getItem('user'));

  const [artworks, setArtworks] = useState([]);
  const [progress, setProgress] = useState(0);
  const [artists, setArtists] = useState([]);
  const [isArtistFromDropdown, setIsArtistFromDropDown] = useState(false);
  const { success, error, showSuccess, showError, clearNotifications, isLoading, startLoading, stopLoading } = useNotification();

  const getArtists = async () => {
    const response = await getArtistsInStorage('All');
    const data = response.data;
    setArtists(data);
  };

  useEffect(() => {
    getArtists();
  }, []);

  const handleOnDrop = (files) => {
    const newEntries = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      inputsData: {
        title: "",
        technique: "",
        dimensions: "",
        price: 0,
        notes: ""
      },
      dropdownsData: {
        storageLocation: "",
        cell: "",
        position: 0,
        artist: ""
      }
    }));
    setArtworks((prev) => [...prev, ...newEntries]);
  };

  const handleInputChange = (index, key, event) => {
    const _artworks = [...artworks];
    _artworks[index].inputsData[key] = event.target.value;
    setArtworks(_artworks);
  };

  const handleSelectArtist = (index, newValue) => {
    const _artworks = [...artworks];
    if (!newValue) {
      setIsArtistFromDropDown(false);
      _artworks[index].dropdownsData.artist = "";
    } else {
      setIsArtistFromDropDown(true);
      _artworks[index].dropdownsData.artist = newValue;
    }
    setArtworks(_artworks);
  };

  const handleAddNewArtist = (index, e) => {
    setIsArtistFromDropDown(false);
    const _artworks = [...artworks];
    _artworks[index].dropdownsData.artist = e.target.value;
    setArtworks(_artworks);
  };

  const handleDropdownChange = (index, updatedData) => {
    const _artworks = [...artworks];
    _artworks[index].dropdownsData = {
      ..._artworks[index].dropdownsData,
      ...updatedData,
    };
    setArtworks(_artworks);
  };

  const handleSubmit = async () => {
    try {
      startLoading();
      for (const artwork of artworks) {
        const data = new FormData();
        data.append("file", artwork.file);
        Object.entries(artwork.inputsData).forEach(([key, value]) => data.append(key, value));
        Object.entries(artwork.dropdownsData).forEach(([key, value]) => data.append(key, value));
        data.append("by_user", user.userName);

        await uploadImageWithData(data, (event) => {
          const percentage = Math.round((100 * event.loaded) / event.total);
          setProgress(percentage);
        });
      }

      stopLoading();
      showSuccess('Entries uploaded successfully');
      setArtworks([]);
    } catch (error) {
      setProgress(0);
      stopLoading();
      showError(error.response.data.error);
    }
  };

  const isUploadButtonDisabled = () => {
    return artworks.some(artwork => !artwork.file ||
            !artwork.inputsData.technique ||
            !artwork.inputsData.title ||
            !artwork.dropdownsData.artist ||
            !artwork.dropdownsData.storageLocation) || !artworks.length;
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
            acceptedFormats={{ 'image/jpeg': ['.jpeg', '.png'] }}
            isRequired={true}
            classes={['in-upload']}
            customText="Drag and drop or select files"
          />
          {artworks.map((artwork, index) => (
            <div key={index} className="upload-section">
              <div className="upload-filezone">
                <span className={artwork.file ? 'upload-file-attached' : 'upload-file-not-attached'}></span>
                <span>{artwork.file ? `${artwork.file.name.slice(0, 24)}...` : 'Please attach an image!'}</span>
                {artwork.file && (
                  <img
                    src={DeleteIcon}
                    className='icon'
                    onClick={() => {
                      const _artworks = artworks.filter((_, i) => i !== index);
                      URL.revokeObjectURL(artwork.preview); 
                      setArtworks(_artworks);
                    }}
                  />
                )}
              </div>
              {artwork.file && (
                <img
                  src={artwork?.preview}
                  alt="Image preview"
                  className="image-preview"
                />
              )}
              <Autocomplete
                className="upload-select-artist-autocomplete"
                disablePortal
                options={artists.map(artist => artist.artist)}
                renderInput={(params) => <TextField {...params} label="Artists" />}
                onChange={(event, newValue) => handleSelectArtist(index, newValue)}
              />

              <TextField
                label="Artist - add or select from the list"
                className="upload-textfield"
                value={artwork.dropdownsData.artist}
                disabled={isArtistFromDropdown}
                onChange={(e) => handleAddNewArtist(index, e)}
                required={!isArtistFromDropdown}
              />

              {Object.entries(artwork.inputsData).map(([key, value]) => (
                <TextField
                  key={key}
                  label={key}
                  className="upload-textfield"
                  value={value}
                  onChange={(event) => handleInputChange(index, key, event)}
                  required={key === 'technique' || key === 'title'}
                />
              ))}

              <CascadingDropdowns
                formControlData={artwork.dropdownsData}
                onDropdownChange={(updatedData) => handleDropdownChange(index, updatedData)}
              />
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

export default Upload;
