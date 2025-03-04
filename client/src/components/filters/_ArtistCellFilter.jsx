import { useContext, useEffect, useMemo, useState } from "react";
import CustomAutocomplete from "../reusable/CustomAutocomplete";
import { useParams } from "react-router-dom";
import { getArtistsInStorage } from "../../api/artistsService";
import { getCellsFromStorage } from "../../api/storageService";
import useNotification from "../hooks/useNotification";
import { EntriesContext } from "../contexts/EntriesContext";

function ArtistCellFilter() {

  const {
    selectedCell,
    selectedArtist,
    setSelectedArtist,
    setSelectedCell
  } = useContext(EntriesContext);

  const {name} = useParams();

  const { showError } = useNotification();

  const [artists, setArtists] = useState([]);
  const [cells, setCells] = useState([]);

  useEffect(() => {
    getArtists();
    getCells();
  },[name]);

  const getArtists = async () => {
    try {
      const response = await getArtistsInStorage(name);
      const data = response.data;
      setArtists(data);
    } catch (error) {
      showError(error.response.data.message);
    }
  };
    
    
  const getCells = async () => {
    try {
      const response = await getCellsFromStorage(name);
      const uniqueCells = [...new Set(response.data)];
      setCells(uniqueCells);
    } catch (error) {
      showError(error.response.data.message);
    }
  };

  const artistOptions = useMemo(() => artists.map(artist => artist.artist), [artists]);

  return (
    <>
      <CustomAutocomplete
        options={artistOptions}
        label="Select artist"
        onChange={setSelectedArtist}
        value={selectedArtist}
      />
      <CustomAutocomplete
        options={cells}
        label="Select cell"
        onChange={setSelectedCell}
        value={selectedCell}
      />
    </>
  );
}

export default ArtistCellFilter;