import { useContext } from 'react';
import CustomDialog from './CustomDialog';
import { EntriesContext } from '../contexts/EntriesContext';
import { CircularProgress } from '@mui/material';
import Message from './Message';
import { deleteOne } from '../../api/artworksService';
import useNotification from '../hooks/useNotification';


const DeleteDialog = ({ handleDialogType, handleTriggerRefresh }) => {
  const { currentImages, setCurrentImages } = useContext(EntriesContext);
  const { success, error, showSuccess, showError, clearNotifications, isLoading, startLoading, stopLoading } = useNotification();

  const deleteArtworks = async (artworks) => {
    startLoading();
    try {
      if (Array.isArray(artworks)) {
        const deletePromises = artworks.map(({ download_key, image_key, id }) => 
          deleteOne({ originalFilename: download_key, filename: image_key, id })
        );
        const response = await Promise.allSettled(deletePromises);
        if (response.every(resp => resp.status === 'fulfilled')) {
          showSuccess('Entries deleted successfully!')
        }
        setCurrentImages([]);
      } else {
        const { download_key, image_key, id } = artworks;
        const response = await deleteOne({ originalFilename: download_key, filename: image_key, id });
        if (response.status === 200) {
          showSuccess('Entry deleted successfully!')
        }
        setCurrentImages(prev => prev.filter(image => image.id !== id));
                
      }
      stopLoading();
      handleTriggerRefresh();
      handleDialogType(null);
            
    } catch (error) {
      showError( error.response.data.message)
      stopLoading();
      handleDialogType(null);
    }
  };

  const handleDelete = () => {
    if (currentImages.length > 1) {
      deleteArtworks(currentImages);
    } else if (currentImages.length === 1) {
      deleteArtworks(currentImages[0]);
    }
  };

  return (
    <>
      {isLoading && <CircularProgress className="loader" color="primary" />}
      <Message
        open={success.state ? success.state : error.state}
        handleClose={clearNotifications}
        message={success.message ? success.message : error.message}
        severity={success.state ? "success": "error"}
      />
      <CustomDialog
        openModal={true}
        setOpenModal={() => handleDialogType('delete')}
        title="Are you sure you want to delete the entry/ies"
        handleClickYes={handleDelete}
        handleClickNo={() => {
          handleDialogType(null);
        }}
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
        style={{ padding: '0' }}
      />
    </>
  );
};

export default DeleteDialog;
