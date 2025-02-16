import { downloadFiles } from "../../api/s3Service";
import { saveAs } from 'file-saver';

export const generateBackGroundColor = (storage_name) => {
  switch (storage_name) {
  case "Vasil Levski":
    return "#FFDA0A";
  case "Vasil Levski Folders":
    return "#1EA896";
  case "Charta":
    return "#FF715B";
  case "Lozenets":
    return "#8A89C0";
  case "South Park":
    return "#020887";
  case "Vasil Levski Rooms":
    return "#AB3428";
  case "Collect":
    return "#130303";
  case "Other": 
    return "#FFCDBC";
  default:
    return "#627264";
  }
 
};

export const prepareImagesForLocationChange = (handleDialogType) => {
  handleDialogType('location');
};

export const handleEdit = (arts, navigate) => {
  localStorage.setItem('currentImages', JSON.stringify(arts));
  localStorage.setItem('scrollPosition', window.scrollY);
  navigate('/edit-page');
};

export const downloadOriginalImages = async (downloadKeys) => {
  const response = await downloadFiles(downloadKeys);
  for (let fileUrl of response.data.result) {
    try {
      const fileResponse = await fetch(fileUrl);
      const blob = await fileResponse.blob();
      const imageName =  fileUrl.split('?')[0].split('/').pop(); 
      saveAs(blob, imageName);
    } catch (error) {
      console.log(error);
    }
  }
};