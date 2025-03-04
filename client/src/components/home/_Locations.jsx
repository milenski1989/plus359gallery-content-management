import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './_Locations.css';
import { getAllStorages } from '../../api/storageService';
import useNotification from '../hooks/useNotification';
import { CircularProgress } from '@mui/material';
import Message from '../reusable/Message';
import GoBack from '../reusable/GoBack';

function Locations() {

  const [storages, setStorages] = useState([]);
  let navigate = useNavigate();

  const { error, showError, isLoading, startLoading, stopLoading, clearNotifications } = useNotification();

  useEffect(() => {
    getStorages();
  },[]);

  const getStorages = async () => {
    startLoading();
    try {
      const response = await getAllStorages();
      setStorages(response.data);
      stopLoading();
    } catch (error) {
      stopLoading();
      showError(error.response.data.message);
    }
  };

  const handleStorageSelect = (name) => {
    navigate(`/gallery/:${name}`);
  };

  if (isLoading) return <CircularProgress variant="indeterminate" className="loader" color="primary" />;

  if (error.state) return <Message
    open={error.state}
    handleClose={clearNotifications}
    message={error.message}
    severity="error"
  />;
  
  return <>
    <GoBack handleGoBack={() => navigate(-1)}/>
    <div className="locations-container">
      <div className='location' onClick={() => handleStorageSelect('All')}>
                All
      </div>
      {storages.map(storage => (
        <div key={storage.id} className='location'>
          <div onClick={() => handleStorageSelect(storage.name)}>
            {storage.name}
          </div>
        </div>
      ))} 
    </div>
  </>;  
};

export default Locations;