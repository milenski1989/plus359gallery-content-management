import { DeleteResult } from "typeorm";
import { dbConnection } from "../database";
import { Docs } from "../entities/Docs";
import { S3Service } from "./S3Service";

const docsRepository = dbConnection.getRepository(Docs);

export default class DocsService {
  private static docsService: DocsService;

  private constructor() {}

  static getInstance() {
    if (!DocsService.docsService) {
        DocsService.docsService = new DocsService();
    }

    return DocsService.docsService;
  }

  async getAll() {
    try {
      const docs: Docs[] = await docsRepository.find();
      return docs;
    } catch {
      throw new Error("No docs found!");
    }
  }

async saveDoc(
      title: string,
      notes: string,
      digitalOceanParams: {
        download_url: string;
        download_key: string;
      },
      by_user: string
    ) {
      try {
  
        const { download_url, download_key } = digitalOceanParams;
  
        const newDoc: Docs = await docsRepository.save({
          title,
          notes,
          download_url,
          download_key,
          by_user,
        });
  
        return newDoc;
      } catch (error) {
        console.error("Error saving doc into the database:", error);
        throw new Error("Error saving doc into the database!");
      }
    }

    async delete(originalFilename: string, filename: string, id: number) {
        try {
          await S3Service.getInstance().delete(originalFilename, filename);
        } catch {
          throw new Error("Could not delete the entry!");
        }
    
        try {
          const results: DeleteResult = await docsRepository.delete(id);
          return results;
        } catch (error) {
          throw new Error(error);
        }
      }
}
