// movie.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { MovieListController } from './movie-list.controller';
import { MovieListService } from './movie-list.service';
import { CreateMovieDto } from '../models/dto/create-movie.dto';

describe('MovieController', () => {
  let controller: MovieListController;
  let service: MovieListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieListController],
      providers: [MovieListService],
    }).compile();

    controller = module.get<MovieListController>(MovieListController);
    service = module.get<MovieListService>(MovieListService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a movie', async () => {
      const createMovieDto: CreateMovieDto = {
        title: 'Test Movie',
        genres: 'Action, Adventure',
        duration: "1h 20min",
        rating: "SU",
      };
      const createdMovie = { id: 1, ...createMovieDto };
      jest.spyOn(service, 'create').mockResolvedValue(createdMovie);

      const result = await controller.create(createMovieDto);
      expect(result).toBe(createdMovie);
    });
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      const movies = [{
        title: "Titanic",
        genres: "Drama, Romance, Tragedy",
        duration: "1h 20min",
        rating: "R"
      }]
      jest.spyOn(service, 'findAll').mockResolvedValue(movies);

      const result = await controller.findAll();
      expect(result).toBe(movies);
    });
  });
});
