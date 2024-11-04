import * as express from "express";
import {Request, Response} from "express"
import ArtworksService from "../services/ArtworksService";

export class ArtistsController {
     router: express.Router;

  constructor() {
            this.router = express.Router();
    this.initializeRoutes();
  }


  private initializeRoutes() {
    this.router.get("/allByArtist/:storage", this.getArtistsByStorage);
  }

  getArtistsByStorage = async (req: Request<{ storage: string }, {}, {}, {}>, res: Response) => {
    const { storage } = req.params;
    try {
      const artists: {[key: string]: string}[] = await ArtworksService.getInstance().allByArtist(storage);
      res.status(200).json(artists);
    } catch (error) {
      res.status(400).json(error);
    }
  };
}
