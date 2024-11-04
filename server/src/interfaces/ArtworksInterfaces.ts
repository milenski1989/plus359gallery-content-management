interface FilterQuery {
    sortField?: string;
    sortOrder?: string;
    keywords?: string[];
    selectedArtist?: string;
    selectedCell?: string;
  }

  interface AllQuery {
    page?: string;
    count?: string;
    sortField?: string;
    sortOrder?: string;
  }

  interface DeleteQuery {
     originalFilename: string;
     filename: string;
     id: number;
  }

  interface UpdateBody {
    title: string;
    artist: string;
    technique: string;
    dimensions: string;
    price: number;
    notes: string;
    storageLocation: string;
    cell: string;
    position: number;
    by_user: string;
  }

  export {
    FilterQuery,
    AllQuery,
    DeleteQuery,
    UpdateBody
  }