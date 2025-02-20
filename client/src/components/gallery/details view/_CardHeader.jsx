import { generateBackGroundColor } from "../../utils/helpers";
import CustomCheckbox from "../CustomCheckbox";

import './_CardHeader.css';

function CardHeader({searchResults, art}) {
      
  return (
    <div className="card-header">
      <p className="header">{art.artist || 'No Artist'}</p>
      {art.position ? (
        <div
          className="card-position"
          style={{backgroundColor: generateBackGroundColor(art.storage?.name || art.storage_name)}}>
          <p>{art.position}</p>
        </div>
      ) : null}
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
    </div>
  );
}

export default CardHeader;