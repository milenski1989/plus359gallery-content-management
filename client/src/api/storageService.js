import axios from "axios";
import { API_URL } from "./constants";

export const getAllStorages = async () => {
  return await axios.get(`${API_URL}/storage/all`);
};

export const getEmptyStorages = async () => {
  return await axios.get(`${API_URL}/storage/allEmpty`);
};

export const getAvailablePositions = async (selectedCell, location) => {
  return await axios(`${API_URL}/storage/positions/allEmpty/${selectedCell}/${location}`);
};

export const getCellsFromStorage = async (name) => {
  return await axios.get(`${API_URL}/storage/cells/all/${name.split(':')[1]}`);
};

export const saveStorage = async (name) => {
  return await axios.post(`${API_URL}/storage/saveOne`, {name}, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const deleteStorage = async (name) => {
  return await axios.delete(`${API_URL}/storage/deleteOne`, {params: {name}});
};

export const updateLocations = async (ids, formControlData) => {
  return await axios.put(
    `${API_URL}/storage/update-location`,
    {ids, formControlData}
  );
};