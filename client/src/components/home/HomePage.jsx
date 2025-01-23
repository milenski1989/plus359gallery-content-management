import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './HomePage.css';
import { getAllStorages } from '../../api/storageService';

const HomePage = () => {

  const [storages, setStorages] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    getStorages();
  },[]);

  const getStorages = async () => {
    try {
      const response = await getAllStorages();
      setStorages(response.data);
    } catch (error) {
      throw new Error(error);
    }
  };

  const handleStorageSelect = (name) => {
    navigate(`/gallery/:${name}`);
  };
  
  return <>
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

export default HomePage;