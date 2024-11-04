import * as express from "express";
import {Request, Response} from 'express';
import StorageService from "../services/StorageService";
import { UpdateLocationBody } from "../interfaces/StoragesInterfaces";
import {Storages} from '../entities/Storages';
export class StorageController {
  router: express.Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/all", this.getAllStorages);
    this.router.get("/allEmpty", this.getAllEmptyStorages);
    this.router.get("/positions/allEmpty/:cell/:storage", this.getAllEmptyPositions);
    this.router.get("/cells/all/:currentStorage",this.getAllCells);
    this.router.post("/saveOne", this.saveStorage)
    this.router.put("/update-location", this.updateLocation);
    this.router.delete("/deleteOne", this.deleteStorage)
  }

  getAllStorages = async (req: Request, res: Response) => {
    try {
      const results = await StorageService.getInstance().getAllStorages();
      res.status(200).json(results);
    } catch (error) {
      res.status(400).json(error);
    }
  };

  getAllEmptyStorages = async (req: Request, res: Response) => {
    try {
      const results = await StorageService.getInstance().getAllEmptyStorages();

      res.status(200).json(results);
    } catch (error) {
      res.status(400).json(error);
    }
  };

  getAllEmptyPositions = async (req: Request, res: Response) => {
    const { cell, storage } = req.params;

    try {
      const results = await StorageService.getInstance().getFreePositions(cell, storage);

      res.status(200).json(results);
    } catch (error) {
      res.status(400).json(error);
    }
  };

  getAllCells = async (req: Request<{ currentStorage: string }, {}, {}, {}>, res: Response) => {
    const { currentStorage } = req.params;
    try {
      const cellsNames: string[] = await StorageService.getInstance().getAllCells(currentStorage)

      res.status(200).json(cellsNames);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  updateLocation = async (req: Request<{}, {}, UpdateLocationBody, {}>, res: Response) => {
    const { ids, formControlData } = req.body;

    try {
      const results = await StorageService.getInstance().updateLocation(
        ids,
        formControlData
      );
      res.status(200).send(results);
    } catch (error) {
      throw new Error("Could not update locations!");
    }
  };

  saveStorage = async (req: Request<{}, {}, { name: string }, {}>, res: Response) => {
    const { name } = req.body;

    try {
      const results: Storages = await StorageService.getInstance().saveStorage(name);
      res.status(200).send(results);
    } catch (error) {
      res.status(400).send("Storage with this name already exists!");
    }
  };

  deleteStorage = async (req: Request<{}, {}, {}, { name: string }>, res: Response) => {
    const { name } = req.query;

    try {
      const results: Storages = await StorageService.getInstance().deleteStorage(name);
      res.status(200).send(results);
    } catch {
      res.status(400).send({ message: 'Delete storage failed!' });
    }
  };
}
