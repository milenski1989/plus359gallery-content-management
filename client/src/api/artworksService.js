import axios from "axios";
import { API_URL } from "./constants";

export const getAll = async (page, count, sortField, sortOrder, name) => {
  if (!page && !count && !sortField && !sortOrder) {
    return await axios.get(`${API_URL}/artworks/all/${name}`);
  }
  return await axios.get(
    `${API_URL}/artworks/all/${name.split(':')[1]}?count=${count}&page=${page}&sortField=${sortField}&sortOrder=${sortOrder}`
  );
}

export const filterAll = async (keywords, selectedArtist, selectedCell, sortField, sortOrder) => {
  return await axios.get(`${API_URL}/artworks/filter?sortField=${sortField}&sortOrder=${sortOrder}`, {
    params: {
      keywords: keywords,
      selectedArtist: selectedArtist,
      selectedCell: selectedCell
    }
  })
}

export const updateOne = async (updatedEntry, id) => {
  return await axios.put(`${API_URL}/artworks/update/${id}`, updatedEntry);
}

export const deleteOne = async (params) => {
  return await axios.delete(`${API_URL}/artworks/delete/${params}`, { params });
}
