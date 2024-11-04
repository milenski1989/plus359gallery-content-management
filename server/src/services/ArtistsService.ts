import { dbConnection } from "../database";
import { Artists } from "../entities/Artists";

const artistsRepository = dbConnection.getRepository(Artists);

export default class ArtistsService {
  private static artistsService: ArtistsService;

  private constructor() {}

  static getInstance() {
    if (!ArtistsService.artistsService) {
      ArtistsService.artistsService = new ArtistsService();
    }

    return ArtistsService.artistsService;
  }

  async getOneByName(name: string) {
    try {
      const artist: Artists = await artistsRepository.findOne({
        where: { artist: name },
      });

      return artist;
    } catch {
      throw new Error("No bio for this artist found!");
    }
  }
}
