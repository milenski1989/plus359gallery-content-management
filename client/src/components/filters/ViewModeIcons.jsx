import { useContext } from 'react'
import { EntriesContext } from '../contexts/EntriesContext';
import ListViewIcon from '../../assets/list-view-solid.svg';
import ThumbnailViewIcon from '../../assets/thumbnail-view-solid.svg';
import DetailsViewIcon from '../../assets/details-view-solid.svg';
import './ViewModeIcons.css'

function ViewModeIcons({viewMode, handleViewMode}) {

  const {
    setCurrentImages
  } = useContext(EntriesContext);

  const handleChangeViewMode = (mode) => {
    handleViewMode(mode)
    setCurrentImages([])
  }

  return (
    <div className='view-mode-icons-container'>
      <img
        className={viewMode === 'details' ? 'selected icon' : 'icon'}
        src={DetailsViewIcon}
        onClick={() => handleChangeViewMode('details')}
        alt="Details View"
      />
      <img
        className={viewMode === 'thumbnail' ? 'selected icon' : 'icon'}
        src={ThumbnailViewIcon}
        onClick={() => handleChangeViewMode('thumbnail')}
        alt="Thumbnail View"
      />
      <img
        className={viewMode === 'list' ? 'selected icon' : 'icon'}
        src={ListViewIcon}
        onClick={() => handleChangeViewMode('list')}
        alt="List View"
      />
    </div>
  )
}

export default ViewModeIcons