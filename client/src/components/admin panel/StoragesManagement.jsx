import { useEffect, useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import Message from '../reusable/Message';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CustomDialog from '../reusable/CustomDialog';
import { deleteStorage, getEmptyStorages } from '../../api/storageService';
import useNotification from '../hooks/useNotification';
import AddNewStorage from './AddNewStorage';

import './StoragesManagement.css';

const StoragesManagement = () => {

  const { success, error, showSuccess, showError, clearNotifications, isLoading, startLoading, stopLoading } = useNotification();

  const [storages, setStorages] = useState([]);
  const [selectedStorage, setSelectedStorage] = useState();
  const [showInputs, setShowInputs] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    getStoragesWithNoEntries();
  },[]);

  const getStoragesWithNoEntries = async () => {
    startLoading();
    try {
      const response = await getEmptyStorages();
      setStorages(response.data);
      stopLoading();
    } catch (error) {
      stopLoading();
      showError(error.response.data.message);
    }
  };

  const handleDeleteStorage = async (name) => {
    startLoading();
    try {
      await deleteStorage(name);
    
      const filteredStorages = storages.filter(filter => filter.name !== name);
      setStorages(filteredStorages);
      showSuccess('Storage deleted successfully!');
      stopLoading();
    } catch (error) {
      stopLoading();
      showError(error.response.data.message);
    }
  };

  const handleClickAddNewStorage = () => {
    setShowInputs(true);
  };
      
  return <>
    {isLoading && <CircularProgress className="loader" color="primary" />}
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
      severity="error" />
    {isDialogOpen &&
                <CustomDialog
                  openModal={isDialogOpen}
                  setOpenModal={() => setIsDialogOpen(true)}
                  title="Are you sure you want to delete this empty storage and its divisions and positions ?"
                  handleClickYes={async () => {
                    await handleDeleteStorage(selectedStorage);
                    getEmptyStorages();
                    setIsDialogOpen(false);
                  }}
                  handleClickNo={() => {setSelectedStorage(); setIsDialogOpen(false);}} 
                  confirmButtonText="Yes"
                  cancelButtonText="Cancel"
                  style={{padding: '0'}}
                />}

   
    {showInputs ?
      <AddNewStorage setShowInputs={setShowInputs} setStorages={setStorages}/>
      :
      <div className="add-new-storage-button-container">
        <Button
          onClick={handleClickAddNewStorage}
          variant="contained">
          Add New
        </Button>
      </div>
    }
    <div className="storages-management-locations">
      {storages.map(storage => (
        <div 
          className="storages-management-location"
          key={storage.id} 
        >
          <div>
            {storage.name}
          </div>
          <DeleteOutlineIcon 
            className='icon'
            style={{ cursor: 'pointer' }}
            onClick={() => {setSelectedStorage(storage.name); setIsDialogOpen(true);}}
          />
        </div>
      ))}
    </div>
  </>;  
};

export default StoragesManagement;