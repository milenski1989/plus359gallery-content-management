import { createContext, useMemo, useState } from 'react';

const EntriesContext = createContext();

const EntriesProvider = ({ children }) => {
  const [currentImages, setCurrentImages] = useState([]);
  const [updatedEntry, setUpdatedEntry] = useState({});
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pagesCount, setPagesCount] = useState(0);
  const [countPerPage, setCountPerPage] = useState(25);

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
    }),
    [currentImages, updatedEntry, page, totalCount, pagesCount, countPerPage, startItem, endItem]
  );

  return (
    <EntriesContext.Provider
      value={contextValue}>
      {children}
    </EntriesContext.Provider>
  );
};

export { EntriesContext, EntriesProvider };
