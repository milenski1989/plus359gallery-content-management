import { Dialog, DialogContent } from "@mui/material";
import CardFooter from "../details view/CardFooter";
import { useNavigate } from "react-router-dom";
import { downloadOriginalImage, handleEdit } from "../../utils/helpers";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import { useContext } from "react";
import { EntriesContext } from "../../contexts/EntriesContext";

function ListViewDialog({selectedRow, setSelectedRow, handleDialogType}) {

  const navigate = useNavigate();

  const { currentImages, setCurrentImages } = useContext(EntriesContext);

  const prepareImagesForLocationChange = (art) => {
    setCurrentImages([art]);
    handleDialogType('location');
  };

  return (
    <>
      <Dialog open={selectedRow} onClose={() => setSelectedRow(null)}>
        <DialogContent>
          <div className="full-info-dialog">
            <img
              src={selectedRow.image_url}
              alt="list-item-image" />
            <CardFooter art={selectedRow} />
            {currentImages.length === 1 ?
              <div className="row-actions"> 
                <EditIcon 
                  fontSize="medium" 
                  onClick={() => handleEdit([selectedRow], setCurrentImages, navigate)}/>
                <>
                  <FileDownloadIcon fontSize="medium" onClick={() => downloadOriginalImage(currentImages.map(image => image.download_key))}/>
                  <DeleteOutlineIcon
                    fontSize="medium"
                    onClick={() => {
                      handleDialogType('delete');
                    }} />
                  <DriveFileMoveIcon fontSize="medium" onClick={() => prepareImagesForLocationChange(selectedRow)} />
                                 
                  <PictureAsPdfIcon fontSize="medium" onClick={() => navigate('/pdf')}/>
                </>
              </div>
              :
              null
            }
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ListViewDialog;