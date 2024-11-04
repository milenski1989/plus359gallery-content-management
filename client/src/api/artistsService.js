import axios from "axios"
import { API_URL } from "./constants"

export const getArtistsInStorage = async (name) => {
    const storageName = name.includes(':') ? name.split(':')[1] : name;
    return await axios.get(`${API_URL}/artists/allByArtist/${storageName}`)
}