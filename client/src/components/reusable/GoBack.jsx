import ArrowBackIcon from '@mui/icons-material/ArrowBackIos';
import './GoBack.css';

function GoBack({handleGoBack}) {

  return (
    <ArrowBackIcon className="go-back-icon" onClick={handleGoBack} />
  );
}

export default GoBack;