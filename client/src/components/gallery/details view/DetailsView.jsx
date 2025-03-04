import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
import Card from './Card';

const DetailsView = ({setDialogType, searchResults}) => {

  return <div className="details-view-content-container">
    <ResponsiveMasonry
      columnsCountBreakPoints={{400: 1, 600: 2, 750: 3, 900: 4, 1000: 5, 1200: 6}}
    >
      <Masonry gutter='1rem'>
        {searchResults.map(art => (
          <Card 
            key={art.id}
            handleDialogType={setDialogType}
            art={art}
            searchResults={searchResults} 
          />
        ))} 
      </Masonry>
    </ResponsiveMasonry>
  </div>;
};

export default DetailsView;