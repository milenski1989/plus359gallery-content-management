import './ThumbnailView.css'
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import Thumbnail from './Thumbnail';

const ThumbnailView = ({searchResults}) => {
    return <>
        <ResponsiveMasonry
            columnsCountBreakPoints={{400: 1, 600: 2, 750: 3, 900: 4, 1000: 5, 1200: 7}}
        >
            <Masonry gutter='1rem'>
                {searchResults.map(art => (
                    <Thumbnail 
                        key={art.id} 
                        artwork={art}
                        searchResults={searchResults}/>
                ))}
            </Masonry>
        </ResponsiveMasonry>
    </>
}

export default ThumbnailView