import axios from "axios";
import { API_URL } from "./constants";

export const getAllDocs = async () => {
  return await axios.get(`${API_URL}/docs/getAll`);
};