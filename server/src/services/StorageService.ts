import { In, IsNull, QueryRunner } from "typeorm";
import { dbConnection } from "../database";
import { Artworks } from "../entities/Artworks";
import { Storages } from "../entities/Storages";
import { Cells } from "../entities/Cells";
import { Positions } from "../entities/Positions";

const artsRepository = dbConnection.getRepository(Artworks);
const cellsRepository = dbConnection.getRepository(Cells);
const positionsRepository = dbConnection.getRepository(Positions);
const storagesRepository = dbConnection.getRepository(Storages);

export default class StorageService {
  private static storageService: StorageService;

  private constructor() {}

  static getInstance() {
    if (!StorageService.storageService) {
      StorageService.storageService = new StorageService();
    }

    return StorageService.storageService;
  }

  async getAllStorages() {
    try {
      const results: Storages[] = await storagesRepository.find({
        relations: ["cells", "cells.positions"],
      });
      return results;
    } catch {
      throw new Error("Error getting free positions in the selected cell");
    }
  }

  async getAllEmptyStorages() {
    try {
      const results: Storages[] = await dbConnection
      .getRepository(Storages)
      .createQueryBuilder("storage")
      .leftJoinAndSelect("storage.artworks", "artwork")
      .where("artwork.id IS NULL")
      .getMany();
      
      return results;
    } catch {
      throw new Error("Error getting storages with no entries!");
    }
  }

  async getOne(name: string) {
    try {
      const result: Storages = await storagesRepository.findOne({
        where: {name: name}});
      return result;
    } catch {
      throw new Error("Error getting free positions in the selected cell");
    }
  }

  async getFreePositions(cell: string, storage: string) {
    try {
    const foundCell: Cells = await cellsRepository.findOne({ where: { name: cell } });
    const foundStorage: Storages = await storagesRepository.findOne({ where: { name: storage } });

    const cells: Cells = await cellsRepository.findOne({
      where: { id: foundCell.id, storage_id: foundStorage.id},
      relations: ['artworks']
    });
    const positions: Positions[] = await positionsRepository.find({
      where: {cell_id: foundCell.id, cell: {storage_id: foundStorage.id}}
    })

    const freePositions: Positions[] = positions.filter(position => cells.artworks.every(artwork => position.id !== artwork.position_id))
    const response: string[] = freePositions.map(freePosition => freePosition.name)
    
    return response;
    } catch {
      throw new Error("Error getting spare positions from the selected cell!");
    }
  }

  async updateLocation(
    ids: number[],
    formControlData: {
      storageLocation: string;
      cell: string;
      position: number;
    }
  ) {
    const { storageLocation, cell, position } = formControlData;
    const promises = [];
    try {
      const images: Artworks[] = await artsRepository.findBy({ id: In([ids]) });

      const foundStorage: Storages = await this.getOne(storageLocation);

      const foundCell: Cells = await cellsRepository.findOne({where: {name: cell, storage_id: foundStorage.id}})

      let foundPosition: Positions;
      if (foundCell) {
        foundPosition = await positionsRepository.findOne({where: {cell_id: foundCell.id, cell: {storage_id: foundStorage.id},  name: position.toString()}})
      }

      if (foundStorage) {
        for (let image of images) {
          promises.push(
            await artsRepository.save({
              id: image.id,
              storageLocation: storageLocation,
              cell: cell || "",
              position: position || 0,
              storage_id: foundStorage.id,
              cell_id: foundCell ? foundCell.id : 0,
              position_id: foundPosition ? foundPosition.id : 0
            })
          );
        }

        const result = await Promise.all(promises);
        return result;
      }
    } catch {
      throw new Error("Could not update locations!");
    }
  }

  async saveStorage(name: string) {
      const queryRunner: QueryRunner = dbConnection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
    try {
      const foundStorage: Storages = await this.getOne(name);

      if (foundStorage) throw new Error();
      else {

        await queryRunner.query(`
          INSERT INTO storages (name)
          VALUES (?)
        `, [name]);
  
        const [storageId] = await queryRunner.query(`
          SELECT MAX(id) as id FROM storages
        `);

        await queryRunner.query(`
          INSERT INTO cells (name, storage_id)
          VALUES (?, ?)
        `, [`${name}1`, storageId.id]);

        const [cellId] = await queryRunner.query(`
          SELECT MAX(id) as id FROM cells
        `);
  
        await queryRunner.query(
          `
          INSERT INTO positions (name, cell_id)
          SELECT n, ?
          FROM (
            WITH RECURSIVE numbers AS (
              SELECT 1 AS n
              UNION ALL
              SELECT n + 1 FROM numbers WHERE n < 100
            )
            SELECT n FROM numbers
          ) AS t;
          `,
          [cellId.id]
        );

        await queryRunner.commitTransaction();

        return await storagesRepository.findOneBy({name: name})
      }
    } catch {
      await queryRunner.rollbackTransaction();
      throw new Error("Storage with this name already exists!");
    } finally {
      await queryRunner.release();
    }
  }

  async deleteStorage(name: string) {
    const queryRunner: QueryRunner = dbConnection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const foundStorage: Storages = await this.getOne(name);

      if (foundStorage) {
        const cell: Cells = await queryRunner.manager.findOne(Cells, {where: { storage_id: foundStorage.id }});
        if (cell) {
          await queryRunner.manager.delete("positions", { cell_id: cell.id });
          await queryRunner.manager.delete("cells", { id: cell.id, storage_id: foundStorage.id });
        }
        await queryRunner.manager.delete("storages", { id: foundStorage.id });
        await queryRunner.commitTransaction();
        return foundStorage;
      } else {
         throw new Error('No storage with this name was found!')
      }
    } catch {
      await queryRunner.rollbackTransaction();
      throw new Error('Delete storage failed!');
    } finally {
      await queryRunner.release();
    }
  }

  async getAllCells(currentStorage: string): Promise<string[]> {
    try {
      const cells: Cells[] = currentStorage === 'All'
        ? await cellsRepository.find({ select: ["name"] })
        : await cellsRepository.find({
            where: { storage: { name: currentStorage } },
            select: ["name"],
            relations: ["storage"]
          });
  
      return cells.map(cell => cell.name);
    } catch (error) {
      throw new Error("Failed to fetch cells.");
    }
  }
}
