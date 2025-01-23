import { useEffect, useState } from 'react';
import { CircularProgress, TextField } from '@mui/material';
import { useMediaQuery } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '../../assets/save-solid.svg';
import Message from '../reusable/Message';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CustomDialog from '../reusable/CustomDialog';
import { deleteStorage, getEmptyStorages, saveStorage } from '../../api/storageService';
import '../home/HomePage.css';
import './StoragesManagement.css';
import useNotification from '../hooks/useNotification';

const StoragesManagement = () => {
  const { success, error, showSuccess, showError, clearNotifications, isLoading, startLoading, stopLoading } = useNotification();
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  const [storages, setStorages] = useState([]);
  const [selectedStorage, setSelectedStorage] = useState();
  const [newStorageName, setNewStorageName] = useState();
  const [showInput, setShowInput] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    getStoragesWithNoEntries();
  },[]);

  const getStoragesWithNoEntries = async () => {
    try {
      const response = await getEmptyStorages();
      setStorages(response.data);
    } catch (error) {
      throw new Error(error);
    }
  };

  const handleSaveStorage = async (name) => {
    try {
      const response = await saveStorage(name);
      const newStorage = response.data;
      setStorages(prev => [...prev, newStorage]);
      showSuccess('Storage saved successfully!');
    } catch (error) {
      showError(error.response.data.message);
    }
  };

  const handleDeleteStorage = async (name) => {
    startLoading();
    try {
      const response = await deleteStorage(name);
      if (response.status === 200) {
        const filteredStorages = storages.filter(filter => filter.name !== name);
        setStorages(filteredStorages);
        showSuccess('Storage deleted successfully!');
      }
      stopLoading();
    } catch (error) {
      stopLoading();
      showError(error.response.data.message);
    }
  };

  const handleClickAddNewStorage = () => {
    setShowInput(true);
  };

  const handleChange = (e) => {
    setNewStorageName(e.target.value);
  };

  const handleSaveNewStorage = async () => {
    if (!newStorageName) return;
    await handleSaveStorage(newStorageName);
    setShowInput(false);
    getEmptyStorages();
  };

  const handleCancel = () => {
    setNewStorageName();
    setShowInput(false);
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
                  title="Are you sure you want to delete this empty storage and all related cells and positions ?"
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

    <div  
      className="locations-container">
      {showInput ?
        <div className="textfield-icon-container">
          <TextField sx={isSmallDevice ?
            {
              '& .MuiOutlinedInput-root':{
                borderRadius: '37px', width: '242px', height: '47px'
              }} :
            {
              '& .MuiOutlinedInput-root':{
                borderRadius: '37px', width: '242px', height: '47px'
              }}
          } placeholder='Enter name...' onChange={(e) => handleChange(e)} />
          <div className="icons-container">
            <img className="save-icon" src={SaveIcon} onClick={handleSaveNewStorage}/>
            <CloseIcon className="close-icon" onClick={handleCancel}/>
          </div>
        </div>
        :
        <div 
          onClick={handleClickAddNewStorage}
          className="add-new-storage location"><AddIcon/></div>
      }
      {storages.map(storage => (
        <div 
          className="storages-management-location location"
          key={storage.id} 
        >
          <DeleteOutlineIcon 
            className='icon'
            style={{ cursor: 'pointer' }}
            onClick={() => {setSelectedStorage(storage.name); setIsDialogOpen(true);}}
          />
          <div>
            {storage.name}
          </div>
                   
        </div>
      ))}
    </div></>;  
};

export default StoragesManagement;