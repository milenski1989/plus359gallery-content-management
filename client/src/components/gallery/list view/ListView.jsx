import { useCallback, useContext, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import { EntriesContext } from "../../contexts/EntriesContext";
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ShowMoreIcon from '@mui/icons-material/MoreHoriz';
import { generateBackGroundColor } from "../../utils/helpers";
import Actions from "../../reusable/Actions";
import ListViewDialog from "./ListViewDialog";

import './ListView.css';

const header = [
  {name: 'Position', className: ''},
  {name: '', className: ''},
  {name: 'Artist', className: 'item'},
  {name: 'Dimensions', className: 'item'},
  {name: 'Technique', className: 'item'},
  {name: 'Cell', className: 'item'},
  {name: '', className: 'width-20'},
];

const rowCells = [
  {name: 'artist', className: 'item'},
  {name: 'dimensions', className: 'item'},
  {name: 'technique', className: 'item'},
  {name: 'cell', className: 'item'}
];

const ListView = ({ searchResults, handleDialogType }) => {
  
  const { currentImages, setCurrentImages } = useContext(EntriesContext);

  const [selectedRow, setSelectedRow] = useState(null);

  const truncateRowCell = (value, length) => {
    if (!value) return '';
    if (value.length > length) {
      return `${value.slice(0, length)}...`;
    }
    return value;
  };

  const openFullInfoDialog = (art) => {
    setSelectedRow(art);
    setCurrentImages([art]);
  };

  const handleCheckboxChange = useCallback((id) => {
    setCurrentImages((prevSelected) => {
      if (prevSelected.some((item) => item.id === id)) {
        return prevSelected.filter((image) => image.id !== id);
      } else {
        return [...prevSelected, searchResults.find((image) => image.id === id)];
      }
    });
  }, [setCurrentImages, searchResults]);

  return (
    <>
      <div className="list-header">
        {header.map(({name, className}) => (
          <div key={name} className={className}>{name}</div>
        ))}
      </div>
      <div className="rows">
        {searchResults.map((art, ind) => {
          const labelId = `checkbox-list-secondary-label-${ind}`;
          return (
            <div className="row-container" key={labelId}>
              <div
                className={`row-position ${art.position ? 'position-text' : ''}`}
                style={{backgroundColor: generateBackGroundColor(art.storage?.name || art.storage_name)}}>
                <p>{art.position ? art.position : ''}</p>
              </div>
              <img
                className="row-image"
                src={art.image_url}
                alt="list-item-image" />
              {rowCells.map(({name, className}) => (
                <div key={name} className={className}>
                  <p>{truncateRowCell(art[name], 25)}</p>
                </div>
              ))}
              <Checkbox
                onChange={() => handleCheckboxChange(art.id)}
                checked={currentImages.some(image => image.id === art.id)}
                icon={<RadioButtonUncheckedIcon />}
                checkedIcon={<CheckCircleOutlineIcon />} />
              <Actions 
                classes="row-actions"
                fontSize="medium"
                arts={[art]}
                handleDialogType={handleDialogType}
              />
              <ShowMoreIcon className="more-horizon-icon" fontSize="medium" onClick={() =>  openFullInfoDialog(art)} />
            </div>
          );
        })}
      </div>
      {selectedRow && <ListViewDialog selectedRow={selectedRow} setSelectedRow={setSelectedRow} handleDialogType={handleDialogType}/>}
    </>
  );
};

export default ListView;