import * as express from "express";
import {Request, Response} from "express"
import DocsService from "../services/DocsService";
import { DeleteQuery } from "../interfaces/ArtworksInterfaces";
import { DeleteResult } from "typeorm";

export class DocsController {
     router: express.Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/all", this.getAll);
    this.router.get("/delete", this.delete);
  }

  getAll = async (req: Request, res: Response) => {
    try {
       const docs = await DocsService.getInstance().getAll();
        res.status(200).json({ docs });
    } catch (error) {
      res.status(400).json(error);
    }
  };

  
  delete = async (req:  Request<{}, {}, {}, DeleteQuery>, res: Response) => {
    const { originalFilename, filename, id } = req.query;

    try {
      const results: DeleteResult = await DocsService.getInstance().delete(
        originalFilename,
        filename,
        id
      );
      res.send(results);
    } catch (error ) {
      res.send({ error: (error as Error).message });
    }
  };
}
