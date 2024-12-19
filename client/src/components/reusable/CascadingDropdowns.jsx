import { useState, useEffect, useContext } from 'react';
import { getAllStorages, getAvailablePositions } from '../../api/storageService';
import { EntriesContext } from '../contexts/EntriesContext';
import './CascadingDropdowns.css';
import CustomAutocomplete from './CustomAutocomplete';

function CascadingDropdowns({
  formControlData,
  onDropdownChange,
}) {
  const {currentImages} = useContext(EntriesContext);
  const [location, setLocation] = useState();
  const [cells, setCells] = useState([]);
  const [availablePositions, setAvailablePositions] = useState([]);
  const [storages, setStorages] = useState([]);

  useEffect(() => {
    getStorages();
  }, []);

  const getStorages = async () => {
    try {
      const response = await getAllStorages();
      setStorages(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const findAvailablePositions = async (selectedCell, selectedLocation) => {
    try {
      const response = await getAvailablePositions(selectedCell, selectedLocation);
      const freePositions = response.data;
      setAvailablePositions(freePositions);
    } catch (error) {
      console.error(error);
    }
  };

  const changeLocation = (newValue) => {
    setLocation(newValue);
    const selectedStorage = storages.find((storage) => storage.name === newValue);
    const selectedCells = selectedStorage ? selectedStorage.cells.map((cell) => cell.name) : [];
    setCells(selectedCells);

    onDropdownChange({
      storageLocation: newValue,
      cell: "",
      position: "",
    });
  };

  const changeCell = (newValue) => {
    if (newValue) {
      findAvailablePositions(newValue, location);
    }
    onDropdownChange({
      cell: newValue
    });
  };

  const changePosition = (newValue) => {
    onDropdownChange({
      position: newValue
    });
  };

  return (
    <div className="dropdowns-container">
      <CustomAutocomplete
        className="cascading-dropdown"
        options={storages.map((storage) => storage.name)}
        value={formControlData?.storageLocation || null}
        label="Location *"
        onChange={changeLocation}
      />
      <CustomAutocomplete
        className="cascading-dropdown"
        options={cells}
        value={formControlData?.cell || null}
        label="Cell"
        disabled={!location || location === 'Sold'}
        onChange={changeCell}
      />
      <CustomAutocomplete
        className="cascading-dropdown"
        options={availablePositions}
        value={formControlData?.position || null}
        label="Position"
        disabled={!location || location === 'Sold' || currentImages.length > 1}
        onChange={changePosition}
      />
    </div>
  );
}

export default CascadingDropdowns;
