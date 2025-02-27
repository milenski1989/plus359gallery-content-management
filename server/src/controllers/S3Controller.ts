
import * as express from 'express';
import {Request, Response} from 'express';
import ArtworksService from '../services/ArtworksService';
import { MulterRequest, ProcessReplaceRequestBody, ProcessUploadRequestBody } from '../interfaces/S3Interfaces';
import { Artworks } from '../entities/Artworks';
import { S3Service } from '../services/S3Service';

export class S3Controller{

    router: express.Router

    constructor() {
    this.router = express.Router();
    this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/upload', this.upload)
        this.router.post('/replace', this.replace)
        //this.router.get('/:name', this.getArts)
        this.router.get('/file/download', this.download);
    }

    // getArts = async (req, res) => {
    //   const {page, count, sortField, sortOrder} = req.query
    //   const {name} = req.params
    //   try {
    //    const {arts, artsCount} = await ArtworksService.getInstance().all(name, page, count, sortField, sortOrder)
    
    //    res.status(200).json({arts, artsCount});
    //   } catch (error) {
    //     res.status(400).json(error);
    //   }
    // }

    processUploadRequestBody = async (req: Request<{}, {}, ProcessUploadRequestBody, {}>, res: Response) => {
        const { title, artist, technique, dimensions, price, notes, storageLocation, cell, position, by_user } = req.body;
        
        const digitalOceanParams = {
            image_url: (req as MulterRequest).file.transforms[0].location,
            image_key: (req as MulterRequest).file.transforms[0].key,
            download_url: (req as MulterRequest).file.transforms[1].location,
            download_key: (req as MulterRequest).file.transforms[1].key
        }

        const cellParam = cell ? cell : null;
        const positionParam = position ? position : null;

        const result = await ArtworksService.getInstance().save(
            title,
            artist,
            technique,
            dimensions,
            price,
            notes,
            storageLocation,
            cellParam,
            positionParam,
            digitalOceanParams,
            by_user
        );

        res.status(200).json({
            results: result
        });
    };

    upload = async (req: Request<{}, {}, ProcessUploadRequestBody, {}>, res: Response) => { 
        try {
            S3Service.getInstance().uploadSingleFile('file')(req, res, async (uploadErr) => { 
                console.log('here')

                if (uploadErr) {
                    console.error({uploadErr})
                    res.status(400).json({error:'Error during upload'})
                } 
                try {
                    await this.processUploadRequestBody(req, res);
                } catch (err) {
                    res.status(400).json({ error: uploadErr });
                }
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }; 

    processReplaceRequestBody = async (req: Request<{}, {}, ProcessReplaceRequestBody, {}>, res: Response) => {
        const {id, old_image_key, old_download_key} = req.body

        let image_url;
        let image_key;
        let download_url;
        let download_key;

        image_url = (req as MulterRequest).file.transforms[0].location;
        image_key = (req as MulterRequest).file.transforms[0].key;
        download_url = (req as MulterRequest).file.transforms[1].location;
        download_key = (req as MulterRequest).file.transforms[1].key;

        const entryFound: Artworks = await ArtworksService.getInstance().getOne(id)
        
        if (entryFound) await ArtworksService.getInstance().updateImageData(old_image_key, old_download_key, entryFound.id, image_url, image_key, download_url, download_key)

        res.status(200).json({result: image_url});
    };

    replace = async (req: Request<{}, {}, ProcessReplaceRequestBody, {}>, res: Response) => {
    
        try {
            S3Service.getInstance().uploadSingleFile('file')(req, res, async (uploadErr) => {
                try {
                    await this.processReplaceRequestBody(req, res);
                } catch(err){
                    return res.status(400).json({ error: uploadErr });
                }
            });
        } catch (error) {
            res.status(400).json(error);
        }
    }

    download = async (req: Request<{}, {}, {}, { downloadKey: string }>, res: Response) => {
        const {downloadKey} = req.query;
        try {
            const url: string = await S3Service.getInstance().download(downloadKey);
        
        res.status(200).json({ result: url });

        } catch (error) {
            res.status(400).json({error: error.message})
        }
    }
}