import { downloadFile } from "../../api/s3Service";
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

export const downloadOriginalImage = async (downloadKeys) => {
  try {
    const responses = await Promise.all(downloadKeys.map(key => downloadFile(encodeURIComponent(key))));
    for (let response of responses) {
      const {result} = response.data;
      try {
        const fileResponse = await fetch(result);
        const blob = await fileResponse.blob();
        const imageName = result.split("?")[0].split("/").pop();
        saveAs(blob, imageName);
      } catch (error) {
        console.error("Error downloading file:", error);
      }
    }
  } catch (error) {
    console.error("Error processing downloads:", error);
  }
};
