import { DeleteResult } from "typeorm";
import { dbConnection } from "../database";
import { Artworks } from "../entities/Artworks";
import { Cells } from "../entities/Cells";
import { Positions } from "../entities/Positions";
import { Storages } from "../entities/Storages";
import { S3Service } from "./S3Service";

const artsRepository = dbConnection.getRepository(Artworks);
const cellsRepository = dbConnection.getRepository(Cells);
const positionsRepository = dbConnection.getRepository(Positions);
const storagesRepository = dbConnection.getRepository(Storages);

export default class ArtworksService {
  private static artworksService: ArtworksService;

  private constructor() {}

  static getInstance() {
  if (!ArtworksService.artworksService) {
      ArtworksService.artworksService = new ArtworksService();
    }

    return ArtworksService.artworksService;
  }

  async getAll(
    name: string,
    page?: string,
    count?: string,
    sortField?: string,
    sortOrder?: string
  ) {
    try {
      const whereCondition = name !== "All" ? { storage: { name: name } } : {};
      if (!page && !count) {
        const [arts, artsCount]: [arts: Artworks[], artsCount: number] = await artsRepository.findAndCount({
          where: whereCondition
        });

        return { arts, artsCount };
      }

      const take = parseInt(count);
      const skip = take * (parseInt(page) - 1);
      const order = sortField ? { [sortField]: sortOrder.toUpperCase() } : {};

      const [arts, artsCount]: [arts: Artworks[], artsCount: number] = await artsRepository.findAndCount({
        where: whereCondition,
        relations: ["storage", "cell_t", "position_t"],
        order,
        take,
        skip,
      });

      return { arts, artsCount };
    } catch {
      throw new Error("Fetch failed!");
    }
  }

  async getOne(id: number) {
    try {
      return await artsRepository.findOne({where: { id: id }});
    } catch {
      throw new Error("Fetch failed!");
    }
  }

  async filter(
    keywords: string[] = [],
    sortField?: string,
    sortOrder?: string,
    selectedArtist?: string,
    selectedCell?: string
  ) {

    // Base condition: exclude 'Sold'
    const conditions: string[] = ["artworks.storageLocation NOT IN ('Sold')"];
    const params: any[] = [];
  
    // Add filter for artist if provided
    if (selectedArtist) {
      conditions.push("artworks.artist = ?");
      params.push(selectedArtist);
    }
  
    // Add filter for cell if provided
    if (selectedCell) {
      conditions.push("artworks.cell = ?");
      params.push(selectedCell);
    }
  
    // Determine the concatenation of fields for keyword search
    if (keywords.length) {
      let concatFields: string;
      if (!selectedArtist && !selectedCell) {
        // When no filters are applied, search all fields.
        concatFields = "CONCAT_WS(' ', artworks.artist, artworks.title, artworks.technique, artworks.notes, artworks.storageLocation, artworks.cell)";
      } else if (!selectedArtist && selectedCell) {
        concatFields = "CONCAT_WS(' ', artworks.artist, artworks.title, artworks.technique, artworks.notes, artworks.storageLocation)";
      } else if (selectedArtist && !selectedCell) {
        concatFields = "CONCAT_WS(' ', artworks.title, artworks.technique, artworks.notes, artworks.storageLocation, artworks.cell)";
      } else {
        concatFields = "CONCAT_WS(' ', artworks.title, artworks.technique, artworks.notes, artworks.storageLocation)";
      }
    
      // Add a LIKE condition for each keyword
      keywords.forEach((keyword) => {
        conditions.push(`(${concatFields} LIKE ?)`);
        params.push(`%${keyword}%`);
      });
    }
  
    // Build the WHERE clause
    const whereClause = conditions.length ? "WHERE " + conditions.join(" AND ") : "";
  
    // Construct the main query
    const query = `
      SELECT artworks.*, 
             storages.name AS storage_name, 
             cells.name AS cell_name, 
             positions.name AS position_name
      FROM artworks
      LEFT JOIN storages ON artworks.storage_id = storages.id
      LEFT JOIN cells ON artworks.cell_id = cells.id
      LEFT JOIN positions ON artworks.position_id = positions.id
      ${whereClause}
      ORDER BY ${sortField} ${sortOrder.toUpperCase()}
    `;
  
    // Construct the count query
    const countQuery = `
      SELECT COUNT(*) AS total_count
      FROM artworks
      LEFT JOIN storages ON artworks.storage_id = storages.id
      LEFT JOIN cells ON artworks.cell_id = cells.id
      LEFT JOIN positions ON artworks.position_id = positions.id
      ${whereClause}
    `;
  
    // Execute both queries in parallel
    const [artworks, totalCount] = await Promise.all([
      dbConnection.query(query, params),
      dbConnection.query(countQuery, params),
    ]);
  
    return { artworks, totalCount: totalCount[0].total_count };
  }
  
  async allByArtist(storage: string) {
    try {
      if (storage !== "All") {
        return await dbConnection.query(
          `SELECT DISTINCT artist from artworks where storageLocation = '${storage}'`
        );
      }
      return await dbConnection.query(`SELECT DISTINCT artist from artworks`);
    } catch {
      throw new Error("No artists found!");
    }
  }

  async save(
    title: string,
    artist: string,
    technique: string,
    dimensions: string,
    price: number,
    notes: string,
    storageLocation: string,
    cellParam: string,
    positionParam: number,
    digitalOceanParams: {
      image_url: string;
      image_key: string;
      download_url: string;
      download_key: string;
    },
    by_user: string
  ) {
    try {
      let foundCellId: number = null;
      let foundPositionId: number = null;

      const foundStorage: Storages = await storagesRepository.findOne({
        where: { name: storageLocation },
      });

      if (cellParam) {
        const foundCell: Cells = await cellsRepository.findOne({
          where: { name: cellParam },
        });
        foundCellId = foundCell ? foundCell.id : null;
      }

      if (foundCellId && positionParam) {
        const foundPosition: Positions = await positionsRepository.findOne({
          where: { cell_id: foundCellId, name: positionParam.toString() },
        });
        foundPositionId = foundPosition ? foundPosition.id : null;
      }

      const { image_url, image_key, download_url, download_key } = digitalOceanParams;

      const newArtwork: Artworks = await artsRepository.save({
        title,
        artist,
        technique,
        dimensions,
        price,
        notes,
        storageLocation,
        cell: cellParam || null,
        position: positionParam || null,
        image_url,
        image_key,
        download_url,
        download_key,
        by_user,
        storage_id: foundStorage.id,
        cell_id: foundCellId,
        position_id: foundPositionId,
      });

      return newArtwork;
    } catch (error) {
      console.error("Error saving artwork into the database:", error);
      throw new Error("Error saving artwork into the database!");
    }
  }

  async updateImageData(
    old_download_key: string,
    old_image_key: string,
    id: number,
    image_url: string,
    image_key: string,
    download_url: string,
    download_key: string
  ) {
    try {
      await S3Service.getInstance().delete(old_download_key, old_image_key);

      await dbConnection
        .createQueryBuilder()
        .update(Artworks)
        .set({ image_url, image_key, download_url, download_key })
        .where("id = :id", { id: id })
        .execute();
    } catch {
      throw new Error("Error updating image data in database!");
    }
  }

  async delete(originalFilename: string, filename: string, id: number) {
    try {
      await S3Service.getInstance().delete(originalFilename, filename);
    } catch {
      throw new Error("Could not delete the entry!");
    }

    try {
      const results: DeleteResult = await artsRepository.delete(id);
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(
    title: string,
    artist: string,
    technique: string,
    dimensions: string,
    price: number,
    notes: string,
    storageLocation: string,
    cell: string,
    position: number,
    by_user: string,
    id: number
  ) {
    const updatedEntry = {
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
    };
    try {
      const item: Artworks = await artsRepository.findOneBy({ id: id });
      artsRepository.merge(item, updatedEntry);
      const results: Artworks = await artsRepository.save(item);
      return results;
    } catch {
      throw new Error("Could not update entry");
    }
  }
}
