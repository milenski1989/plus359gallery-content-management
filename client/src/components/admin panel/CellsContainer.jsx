import { IconButton, TextField } from '@mui/material';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

function CellsContainer({cells, setCells}) {

  const handleChangeCell = (index, field, value) => {
    const updatedCells = [...cells];
    updatedCells[index][field] = value;
    setCells(updatedCells);
  };

  const handleRemoveCell = (index) => {
    if (cells.length === 1) return;
    const updatedCells = cells.filter((_, i) => i !== index);
    setCells(updatedCells);
  };

  return (
    <div className="cells-container">
      {cells.map((cell, index) => (
        <div key={index} className="new-cell-fields">
          <TextField
            fullWidth
            label="Section"
            value={cell.name}
            onChange={(e) => handleChangeCell(index, "name", e.target.value)}
            className="input-field"
          />
          <TextField
            fullWidth
            placeholder="Section"
            type="number"
            pattern="[0-9]*"
            value={cell.startPosition}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                handleChangeCell(index, "startPosition", value === "" ? "" : Number(value));
              }
            }}
            className="input-field"
          />
          <TextField
            fullWidth
            type="number"
            value={cell.endPosition}
            onChange={(e) =>
              handleChangeCell(index, "endPosition", Number(e.target.value))
            }
            className="input-field"
          />
      
          <IconButton
            sx={{color: '#40C8F4'}}
            onClick={() => handleRemoveCell(index)}
            disabled={cells.length === 1}
          >
            <DeleteOutlineIcon />
          </IconButton>
        </div>
      ))}
    </div>
  );
}

export default CellsContainer;