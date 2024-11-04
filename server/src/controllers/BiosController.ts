import * as express from "express";
import {Request, Response} from "express";
import BiosService from "../services/BiosService";
import { ArtistsBios } from "../entities/ArtistsBios";

export class BiosController {
  router: express.Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/one/:name", this.getOne);
    this.router.put("/update/:id", this.updateOne);
  }

  getOne = async (req: Request<{ name: string }, {}, {}, {}>, res: Response) => {
    const { name } = req.params;
    try {
      const bio: ArtistsBios = await BiosService.getInstance().getOne(name);

      res.status(200).json(bio);
    } catch (error) {
      res.status(400).json(error);
    }
  };

  updateOne = async (req: Request<{ id: number }, {}, { bio: string }, {}>, res: Response) => {
    const { bio } = req.body;
    const { id } = req.params;

    try {
      const result: ArtistsBios = await BiosService.getInstance().updateOne(id, bio);

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json(error);
    }
  };
}
