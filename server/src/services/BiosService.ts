import { dbConnection } from "../database";
import { Artists } from "../entities/Artists";
import { ArtistsBios } from "../entities/ArtistsBios";
import ArtistsService from "./ArtistsService";

const biosRepository = dbConnection.getRepository(ArtistsBios);

export default class BiosService {
  private static biosService: BiosService;

  private constructor() {}

  static getInstance() {
    if (!BiosService.biosService) {
      BiosService.biosService = new BiosService();
    }

    return BiosService.biosService;
  }

  async getOne(name: string) {
    try {
      const artist: Artists = await ArtistsService.getInstance().getOneByName(name);

      if (!artist) {
        throw new Error("Artist not found!");
      } else {
        const bio: ArtistsBios = await dbConnection
          .createQueryBuilder()
          .select("bio")
          .from(ArtistsBios, "bio")
          .leftJoin(Artists, "artist", "artist.id = bio.artistId")
          .where("artistId = :id", { id: artist.id })
          .getOne();

          return bio;
      }
    } catch {
      throw new Error("No bio for this artist found!");
    }
  }

  async updateOne(id: number, bio: string) {
    try {
      const bioFound: ArtistsBios = await biosRepository.findOneBy({ id: id });

      biosRepository.merge(bioFound, { ...bioFound, bio: bio });

      const results: ArtistsBios = await biosRepository.save(bioFound);
      return results;
    } catch (error) {
      throw new Error("Could not update bio!");
    }
  }
}
