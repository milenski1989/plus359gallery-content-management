import { useContext, useState } from "react";
import { EntriesContext } from "./contexts/EntriesContext";
import { generateBackGroundColor } from "./utils/helpers";
import { Button, TextField, Tooltip, useMediaQuery } from "@mui/material";
import { updateOne } from "../api/artworksService";
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SaveIcon from '../assets/save-solid.svg';
import { useNavigate } from "react-router-dom";
import CustomDialog from "./reusable/CustomDialog";
import Message from "./reusable/Message";
import { replaceImage } from "../api/s3Service";
import './EditPage.css';
import useNotification from "./hooks/useNotification";

const keysToMap = ['Artist', 'Title', 'Technique', 'Dimensions', 'Price', 'Notes'];

function EditPage() {
    let myStorage = window.localStorage;

    let storedImages = JSON.parse(myStorage.getItem('currentImages')) || [];
    const navigate = useNavigate();
    const {
        setIsEditMode,
        setCurrentImages
    } = useContext(EntriesContext);

    const { success, error, showSuccess, showError, clearNotifications, isLoading, startLoading, stopLoading } = useNotification();
    const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

    const [imageReplaceDialogIsOpen, setImageReplaceDialogIsOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [file, setFile] = useState();
    const [updatedEntries, setUpdatedEntries] = useState(storedImages);

    const onChangeEditableInput = (event, index) => {
        const { name, value } = event.target;

        setUpdatedEntries((prevState) => {
            const updatedEntries = [...prevState];
            updatedEntries[index] = {
                ...updatedEntries[index],
                [name]: value,
            };
            return updatedEntries;
        });
    };

    const saveUpdatedEntry = (id, index) => {
        handleUpdateEntry(id, index);
    };

    const handleUpdateEntry = async (id, index) => {
        try {
            const response = await updateOne(updatedEntries[index], id);
            if (response.status === 200) {
                showSuccess('Entry updated successfully!');
                const updatedEntriesCopy = [...updatedEntries];
                updatedEntriesCopy[index] = { ...updatedEntries[index] };

                setUpdatedEntries(updatedEntriesCopy);
                myStorage.setItem('currentImages', JSON.stringify(updatedEntriesCopy));
            }
        } catch (error) {
            showError(error.response.data.message)
        }
    };

    const handleGoBack = () => {
        myStorage.removeItem('currentImages');
        setUpdatedEntries([]);
        setIsEditMode(false);
        setCurrentImages([]);
        navigate(-1);
    };

    const imageSelectHandler = (e) => {
        const file = e.target.files[0];
        setFile(file);
    };

    const handleReplaceImage = async () => {
        if (selectedImageIndex === null) return;

        const image = updatedEntries[selectedImageIndex];
        startLoading();
        const data = new FormData();
        data.append("file", file);
        data.append("id", image.id);
        data.append("old_image_key", image.image_key);
        data.append("old_download_key", image.download_key);

        try {
            const response = await replaceImage(data);
            const newImageUrl = response.data.result;

            const updatedEntriesCopy = [...updatedEntries];
            updatedEntriesCopy[selectedImageIndex] = {
                ...updatedEntriesCopy[selectedImageIndex],
                image_url: newImageUrl,
            };
            
            setUpdatedEntries(updatedEntriesCopy);
            myStorage.setItem('currentImages', JSON.stringify(updatedEntriesCopy));
            setImageReplaceDialogIsOpen(false);
            stopLoading()
            showSuccess('Image replaced successfully!');
        } catch (error) {
            stopLoading()
            showError(error.response.data.message)
        }
    };

    const openImageReplaceDialog = (index) => {
        setSelectedImageIndex(index);
        setImageReplaceDialogIsOpen(true);
    };

    return (
        <>
            <Button className="edit-page-go-back" variant="contained" onClick={handleGoBack}>Go back</Button>
            <div style={{width: isSmallDevice ? '80vw' : '50vw'}} className="edit-page-helper-text">
                    Replacing an image does not require saving.
                    Changes in text fields DO require saving !
                    Once you are ready with all edits and they are saved, click Go back button.
                    This will return you to the gallery&apos;s main view and unselect all images.
            </div>
            <div className="edit-page-main-section">
                <Message
                    open={success.state}
                    handleClose={clearNotifications}
                    message={success.message}
                    severity="success"
                />
                <Message
                    open={error.state}
                    handleClose={clearNotifications}
                    message={error.message}
                    severity="error"
                />
                {updatedEntries.map((image, index) => (
                    <div key={image.id} className="edit-page-image-inputs-container">
                        <div className="edit-page-position-container">
                            {image.position !== 0 ? (
                                <div
                                    className="edit-page-position-container"
                                    style={{
                                        backgroundColor: generateBackGroundColor(image.storage?.name || image.storage_name),
                                    }}>
                                    <p className="edit-page-position">{image.position}</p>
                                </div>
                            ) : null}
                        </div>

                        <img style={isSmallDevice ? {minWidth: '40vw', maxWidth: '50vw'}: {width: '25vw'}} className="edit-page-image" src={image.image_url} alt="image for edit" />
                        <div className="edit-page-inputs-actions-container">
                            {keysToMap.map((key) => (
                                <TextField
                                    className="edit-page-input"
                                    key={key}
                                    label={key}
                                    name={key.toLowerCase()}
                                    onChange={(event) => onChangeEditableInput(event, index)}
                                    value={updatedEntries[index][key.toLowerCase()] || ""}
                                />
                            ))}
                            <div className="edit-page-actions-container">
                                <Tooltip title="Replace image">
                                    <SwapHorizIcon className="icon" onClick={() => openImageReplaceDialog(index)} />
                                </Tooltip>
                                <img
                                    src={SaveIcon}
                                    className="icon edit-page-save-icon"
                                    onClick={() => saveUpdatedEntry(image.id, index)}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                {imageReplaceDialogIsOpen && (
                    <CustomDialog
                        openModal={imageReplaceDialogIsOpen}
                        setOpenModal={() => setImageReplaceDialogIsOpen(false)}
                        title="Once you replace the image, the old one is deleted!"
                        handleClickYes={handleReplaceImage}
                        handleClickNo={() => setImageReplaceDialogIsOpen(false)}
                        confirmButtonText="Replace"
                        cancelButtonText="Cancel"
                        disabledConfirmButton={!file || isLoading}
                    >
                        {isLoading ? (
                            <p>Please wait...</p>
                        ) : (
                            <TextField
                                onChange={imageSelectHandler}
                                id="textField"
                                type="file"
                                autoComplete="current-password"
                                required
                            />
                        )}
                    </CustomDialog>
                )}
            </div>
        </>
    );
}

export default EditPage;
