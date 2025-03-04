import { useContext, useState } from "react";
import { EntriesContext } from "../../contexts/EntriesContext";
import ShowMoreIcon from '@mui/icons-material/MoreHoriz';
import { generateBackGroundColor } from "../../utils/helpers";
import Actions from "../../reusable/Actions";
import ListViewDialog from "./ListViewDialog";

import './ListView.css';
import CustomCheckbox from "../CustomCheckbox";

const header = [
  {name: 'Position', className: ''},
  {name: '', className: ''},
  {name: 'Artist', className: 'item'},
  {name: 'Dimensions', className: 'item'},
  {name: 'Technique', className: 'item'},
  {name: 'Section', className: 'item'},
  {name: '', className: 'width-20'},
];

const rowCells = [
  {name: 'artist', className: 'item'},
  {name: 'dimensions', className: 'item'},
  {name: 'technique', className: 'item'},
  {name: 'cell', className: 'item'}
];

const ListView = ({ searchResults, handleDialogType }) => {
  
  const { setCurrentImages } = useContext(EntriesContext);

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
              <CustomCheckbox 
                searchResults={searchResults} 
                id={art.id}
                sx={{
                  color: "black",
                  "&.Mui-checked": {
                    color: "black",
                  },
                }}
              />
              <Actions 
                classes="row-actions"
                fontSize="medium"
                artwork={art}
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