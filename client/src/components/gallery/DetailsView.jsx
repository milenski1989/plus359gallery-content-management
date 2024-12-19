import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import Card from './Card';

const DetailsView = ({handleDialogType, searchResults}) => {
  return <div className="details-view-content-container">
    <ResponsiveMasonry
      columnsCountBreakPoints={{400: 1, 600: 2, 750: 3, 900: 4, 1000: 5, 1200: 7}}
    >
      <Masonry gutter='1rem'>
        {searchResults.map(art => (
          <Card 
            key={art.id}
            handleDialogType={handleDialogType}
            art={art}
            searchResults={searchResults} 
          />
        ))} 
      </Masonry>
    </ResponsiveMasonry>
  </div>
}

export default DetailsView