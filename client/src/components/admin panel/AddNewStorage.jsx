import { CircularProgress, IconButton, TextField } from "@mui/material";
import { Add, Save, Clear } from "@mui/icons-material";
import { useState } from "react";
import { getEmptyStorages, saveStorage } from "../../api/storageService";
import useNotification from "../hooks/useNotification";
import Message from "../reusable/Message";
import CellsContainer from "./CellsContainer";

function AddNewStorage({setShowInputs, setStorages}) {

  const { success, error, clearNotifications, showSuccess, showError, isLoading, startLoading, stopLoading } = useNotification();

  const [newStorageName, setNewStorageName] = useState();
  const [cells, setCells] = useState([{ name: "", startPosition: 1, endPosition: 100 }]);

  const handleChangeStorageName = (e) => {
    setNewStorageName(e.target.value);
  };
    
  const handleAddCell = () => {
    setCells([...cells, { name: "", startPosition: 1, endPosition: 100 }]);
  };
    
  const handleSaveNewStorage = async () => {
    if (!newStorageName || cells.some(cell => !cell.name)) return;
    await handleSaveStorage(newStorageName, cells);
    setShowInputs(false);
    getEmptyStorages();
  };
    
  const handleCancel = () => {
    setNewStorageName();
    setShowInputs(false);
  };

  const handleSaveStorage = async (name, cells) => {
    startLoading();
    try {
      const formattedCells = cells.map(cell => ({
        name: cell.name,
        startPosition: Number(cell.startPosition),
        endPosition: Number(cell.endPosition),
      }));
        
      const response = await saveStorage(name, formattedCells);
      const newStorage = response.data;      
      setStorages(prev => [...prev, newStorage]);
      showSuccess("Storage saved successfully!");
      stopLoading();
    } catch (error) {
      showError(error.response?.data?.message || "An error occurred while saving storage.");
      stopLoading();
    }
  };

  return (
    <div className="add-new-storage-container">
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

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Storage"
        onChange={handleChangeStorageName}
        className="storage-input"
      />
  
      <CellsContainer cells={cells} setCells={setCells}/>
  
      <div className="add-new-storage-actions">
        <IconButton sx={{color: '#40C8F4'}} onClick={handleAddCell} className="icon-button">
          <Add />
        </IconButton>
        <IconButton
          sx={{color: '#40C8F4'}}
          onClick={handleSaveNewStorage}
          disabled={!newStorageName || cells.some((cell) => !cell.name)}
        >
          <Save />
        </IconButton>
        <IconButton sx={{color: '#40C8F4'}} onClick={handleCancel}>
          <Clear />
        </IconButton>
      </div>
    </div>
  );
}

export default AddNewStorage;