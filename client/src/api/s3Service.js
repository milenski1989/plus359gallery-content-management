import axios from "axios";
import { API_URL } from "./constants";

export const uploadImageWithData = async (data, onUploadProgress) => {
  return await axios.post(`${API_URL}/s3/upload`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress
  });
};
export const replaceImage = async (data) => {
  return await axios.post(`${API_URL}/s3/replace`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const downloadFiles = async (downloadKeys) => {
  const keysString = downloadKeys.join(',');
  return axios.get(`${API_URL}/s3/file/download?downloadKeys=${keysString}`);
};
