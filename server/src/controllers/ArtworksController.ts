import * as express from "express";
import ArtworksService from "../services/ArtworksService";
import { Request, Response } from "express";
import { AllQuery, DeleteQuery, FilterQuery, UpdateBody } from "../interfaces/ArtworksInterfaces";
import { Artworks } from "../entities/Artworks";
import { DeleteResult } from "typeorm";

export class ArtworksController {
  router: express.Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/all/:name", this.getAll);
    this.router.get("/filter", this.filter);
    this.router.delete("/delete/:params", this.delete);
    this.router.put("/update/:id", this.update);
  }

  getAll = async (req: Request<{ name: string }, {}, {}, AllQuery>, res: Response) => {
    const { page, count, sortField, sortOrder } = req.query;
    const { name } = req.params;

    try {
      if (!page && !count && !sortField && !sortOrder) {
        const { artsCount }: { artsCount: number} = await ArtworksService.getInstance().getAll(name);
        res.status(200).json({ artsCount });
      } else {
        const { arts, artsCount }: {arts: Artworks[], artsCount: number} = await ArtworksService.getInstance().getAll(
          name,
          page,
          count,
          sortField,
          sortOrder
        );
        res.status(200).json({ arts, artsCount });
      }
    } catch (error) {
      res.status(400).json(error);
    }
  };

  async filter(req: Request<{}, {}, {}, FilterQuery>, res: Response) {
    const { sortField, sortOrder, keywords, selectedArtist, selectedCell } = req.query;

    try {
      const { artworks, totalCount }: {artworks: Artworks, totalCount: number} =
        await ArtworksService.getInstance().filter(
          keywords,
          sortField,
          sortOrder,
          selectedArtist,
          selectedCell
        );
      res.json({ artworks, totalCount });
    } catch (error) {
      console.error("Error:", error);
      res.status(404).json({ error: "No results from the search!" });
    }
  }

  delete = async (req:  Request<{}, {}, {}, DeleteQuery>, res: Response) => {
    const { originalFilename, filename, id } = req.query;

    try {
      const results: DeleteResult = await ArtworksService.getInstance().delete(
        originalFilename,
        filename,
        id
      );
      res.send(results);
    } catch (error ) {
      res.send({ error: (error as Error).message });
    }
  };

  update = async (req: Request<{ id: number }, {}, UpdateBody, {}>, res: Response) => {
    const {
      title,
      artist,
      technique,
      dimensions,
      price,
      notes,
      storageLocation,
      cell,
      position,
      by_user,
    } = req.body;
    const { id } = req.params;
    try {
      const results: Artworks = await ArtworksService.getInstance().update(
        title,
        artist,
        technique,
        dimensions,
        price,
        notes,
        storageLocation,
        cell,
        position,
        by_user,
        id
      );
      res.status(200).send(results);
    } catch (error) {
      throw new Error("Could not update entry!");
    }
  };
}
