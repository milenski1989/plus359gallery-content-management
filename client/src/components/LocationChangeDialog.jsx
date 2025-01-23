import { useContext, useState } from 'react';
import CustomDialog from './reusable/CustomDialog';
import CascadingDropdowns from './reusable/CascadingDropdowns';
import { EntriesContext } from './contexts/EntriesContext';
import { updateLocations } from '../api/storageService';
import './LocationChangeDialog.css';

const LocationChangeDialog = ({
  handleDialogType,
  handleTriggerRefresh
}) => {
  const {
    currentImages,
    setCurrentImages,
    setIsEditMode
  } = useContext(EntriesContext);

  const [formControlData, setFormControlData] = useState({
    storageLocation: "",
    cell: "",
    position: "",
  });

  const updateLocation = async () => {
    const ids = currentImages.map(image => image.id);
    try {
      await updateLocations(ids, formControlData);
      setIsEditMode(false);
      setCurrentImages([]);
    } catch (error) {
      console.log(error);
    } finally {
      handleDialogType(null);
      setCurrentImages([]);
      handleTriggerRefresh();
    }
  };

  const handleDropdownChange = (updatedData) => {
    setFormControlData(prevData => ({
      ...prevData,
      ...updatedData
    }));
  };

  return (
    <>
      <CustomDialog
        openModal={true}
        setOpenModal={() => handleDialogType(null)}
        title="This will change the location of all selected entries, are you sure?"
        handleClickYes={updateLocation}
        handleClickNo={() => {setFormControlData({
          storageLocation: "",
          cell: "",
          position: ""});
        handleDialogType(null);}}
        confirmButtonText="Yes"
        cancelButtonText="No"
      >
                    Summary:
        <div className="current-locations-info-container">
          {currentImages.map((image) => (
            <div className="current-image-info" key={image.id}>
              <p>{image.artist}/{image.title}/{image.dimensions}</p>
              <p>{image.storage?.name || image.storage_name}/{image.cell_t?.name || image.cell_name || 0}/{image.position_t?.name || image.position_name || 0}</p>
            </div>
          ))}
        </div>
                 
        <CascadingDropdowns
          formControlData={formControlData}
          onDropdownChange={handleDropdownChange}
          classes={['in-location-change']}
        />
      </CustomDialog>
    </>
  );
};

export default LocationChangeDialog;
