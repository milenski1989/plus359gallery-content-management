import { createContext, useMemo, useState } from 'react';

const EntriesContext = createContext();

const EntriesProvider = ({ children }) => {

  const [currentImages, setCurrentImages] = useState([]);
  const [updatedEntry, setUpdatedEntry] = useState({});
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pagesCount, setPagesCount] = useState(0);
  const [countPerPage, setCountPerPage] = useState(25);

  // const [keywords, setKeywords] = useState(_keywords ? _keywords.split(/[\s,]+/).map(k => k.trim()) : []);
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedArtist, setSelectedArtist] = useState('');
  const [selectedCell, setSelectedCell] = useState('');
  const [keywords, setKeywords] = useState([]);

  const startItem = useMemo(() => (page - 1) * countPerPage + 1, [page, countPerPage]);
  const endItem = useMemo(() => Math.min(page * countPerPage, totalCount), [page, countPerPage, totalCount]);

  const contextValue = useMemo(
    () => ({
      currentImages,
      setCurrentImages,
      updatedEntry,
      setUpdatedEntry,
      page,
      setPage,
      totalCount,
      setTotalCount,
      pagesCount,
      setPagesCount,
      countPerPage,
      setCountPerPage,
      startItem,
      endItem,
      selectedArtist,
      selectedCell,
      keywords,
      sortField,
      sortOrder,
      setSelectedArtist,
      setSelectedCell,
      setKeywords,
      setSortField,
      setSortOrder
    }),
    [
      currentImages, 
      updatedEntry, 
      page, 
      totalCount, 
      pagesCount, 
      countPerPage, 
      startItem, 
      endItem, 
      selectedArtist,
      selectedCell,
      keywords,
      sortField,
      sortOrder
    ]
  );

  return (
    <EntriesContext.Provider
      value={contextValue}>
      {children}
    </EntriesContext.Provider>
  );
};

export { EntriesContext, EntriesProvider };
