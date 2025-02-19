import {Request} from 'express';

interface ProcessUploadRequestBody {
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

interface ProcessUploadDocRequestBody {
    title: string;
    notes: string;
    by_user: string;
}

interface ProcessReplaceRequestBody {
    id: number;
    old_image_key: string;
    old_download_key: string;
}

interface MulterRequest extends Request {
    file: any;
}

export {
    ProcessUploadRequestBody,
    ProcessUploadDocRequestBody,
    ProcessReplaceRequestBody,
    MulterRequest
}