interface UpdateLocationBody {
    ids: number[];
    formControlData: { 
        storageLocation: string; 
        cell: string; 
        position: number; 
    }
}

export {
    UpdateLocationBody
}