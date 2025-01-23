import { createContext, useState } from 'react';

const EntriesContext = createContext();

const EntriesProvider = ({ children }) => {
  const [currentImages, setCurrentImages] = useState([]);
  const [updatedEntry, setUpdatedEntry] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pagesCount, setPagesCount] = useState(0);
  const [countPerPage, setCountPerPage] = useState(25);

  const startItem = (page - 1) * countPerPage + 1;
  const endItem = Math.min(page * countPerPage, totalCount);

  return (
    <EntriesContext.Provider
      value={{
        currentImages,
        setCurrentImages,
        updatedEntry,
        setUpdatedEntry,
        isEditMode,
        setIsEditMode,
        page,
        setPage,
        totalCount,
        setTotalCount,
        pagesCount,
        setPagesCount,
        countPerPage,
        setCountPerPage,
        startItem,
        endItem
      }}
    >
      {children}
    </EntriesContext.Provider>
  );
};

export { EntriesContext, EntriesProvider };
