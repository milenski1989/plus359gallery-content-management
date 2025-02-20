import Actions from "../../reusable/Actions";
import CardHeader from "./_CardHeader";
import CardImage from "./CardImage";
import CardFooter from "./CardFooter";

import './Card.css';

const Card = ({handleDialogType, searchResults, art}) => {
  
  return (
    <div className="card" key={art.id}>
      <CardHeader searchResults={searchResults} art={art}/>
      <CardImage imageUrl={art.image_url}/>
      <>
        <Actions 
          classes="card-actions"
          fontSize="medium"
          arts={[art]}
          handleDialogType={handleDialogType}
        />
        <CardFooter art={art} />
      </>
    </div>
  );
};

export default Card;