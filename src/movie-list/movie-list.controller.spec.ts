// movie.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { MovieListController } from './movie-list.controller';
import { MovieListService } from './movie-list.service';
import { CreateMovieDto } from '../models/dto/create-movie.dto';
import { getModelToken } from '@nestjs/mongoose';
import { Movie, MovieSchema } from 'src/models/schema/movie.schema';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UpdateMovieDto } from 'src/models/dto/update-movie.dto';

describe('MovieController', () => {
  let controller: MovieListController;
  let service: MovieListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieListController],
      providers: [
        MovieListService,
        {
          provide: getModelToken('Movie'),
          useValue: MovieSchema
        },
        {
          provide: AuthGuard,
          useValue: {
            canActivate: jest.fn().mockImplementation(() => true)
          }
        },
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn().mockImplementation(() => true)
          }
        },
        {
          provide: RolesGuard,
          useValue: {
            canActivate: jest.fn().mockImplementation(() => true)
          }
        }
      ],
    }).compile();

    controller = module.get<MovieListController>(MovieListController);
    service = module.get<MovieListService>(MovieListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined()
    expect(controller).toBeDefined();
  });

  describe('/insertOneMovie', () => {
    it('should create a movie', async () => {
      const createMovieDto: CreateMovieDto = {
        title: 'Test Movie',
        genres: 'Action, Adventure',
        duration: "1h 20min",
        rating: "SU",
        codeTitle: 'testmovie'
      };
      const createdMovie = { id: 1, ...createMovieDto };
      jest.spyOn(service, 'create').mockResolvedValue(createdMovie);

      const result = await controller.create(createMovieDto);
      expect(result.message).toEqual('new movie created')
      expect(result.result).toBe(createdMovie);
    });

    it('should handle missing fields in the request body', async () => {
      const inserMovieDto: CreateMovieDto = {
        title: '',
        codeTitle: '',
        genres: '',
        rating: '',
        duration: ''
      }

      try {
        await controller.create(inserMovieDto)
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException)
        expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST)
        expect(error.getResponse()).toEqual('empty request body fields')
      }
    })

    it('should handle invalid input', async () => {
      const insertMovieDto: CreateMovieDto = null

      try {
        await controller.create(insertMovieDto)
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException)
        expect(error.getStatus()).toBe(HttpStatus.UNPROCESSABLE_ENTITY)
        expect(error.getResponse()).toEqual('request body failed to get parsed')
      }
    })

    it('should handle 500 code error from service', async () => {
      const createMovieDto: CreateMovieDto = {
        title: 'Test Movie',
        genres: 'Action, Adventure',
        duration: "1h 20min",
        rating: "SU",
        codeTitle: 'testmovie'
      }

      const expectedError = new HttpException('test error', HttpStatus.INTERNAL_SERVER_ERROR)

      jest.spyOn(service, 'create').mockRejectedValue(expectedError)

      try {
        await controller.create(createMovieDto)
      } catch (error) {
        expect(error).toEqual(expectedError)
      }
    })
  });

  describe('/fetchAllMovies', () => {
    it('should return an array of movies', async () => {
      const movies = [{
        title: "Titanic",
        codeTitle: "titanic",
        genres: "Drama, Romance, Tragedy",
        duration: "1h 20min",
        rating: "R"
      }]
      jest.spyOn(service, 'findAll').mockResolvedValue(movies);

      const result = await controller.findAll();
      expect(result.details).toBe(movies);
    });

    it('should return empty movies', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([])

      const actualResult = await controller.findAll()

      expect(actualResult.message).toEqual('movies empty')
      expect(actualResult.details).toBeUndefined() // should be undefined because there is no 'details' object in this test case
    })

    it('should handle 500 code error from service', async () =>  {
      const expectedError = new HttpException('test error', HttpStatus.INTERNAL_SERVER_ERROR)

      jest.spyOn(service, 'findAll').mockRejectedValue(expectedError)

      try {
        await controller.findAll()
      } catch (error) {
        expect(error).toEqual(expectedError)
      }
    })
  });

  describe('/fetchOneMovie', () => {
    it('should return one movie from the given title', async () => {
      const mockTitle = "titanic"
      const expectedResult = {
        title: "Titanic",
        codeTitle: "titanic",
        genres: "Drama, Romance, Tragedy",
        duration: "1h 20min",
        rating: "R"
      }

      jest.spyOn(service, 'findOne').mockResolvedValue(expectedResult)

      const actualResult = await controller.findOne(mockTitle)

      expect(actualResult.details).toEqual(expectedResult)
    })

    it('should handle empty query parameter', async () => {
      const title = ''

      try {
        await controller.findOne(title)
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException)
        expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST)
        expect(error.getResponse()).toEqual('empty query parameter')
      }
    })
  })

  describe('/updateOneMovie', () => {
    it('should return an updated movie document', async () => {
      const mockUpdatedMovie: UpdateMovieDto = {
        title: "Titanic",
        codeTitle: "titanic",
        genres: "Drama, Romance, Tragedy",
        duration: "1h 20min",
        rating: "R"
      }

      const title = 'titanic'

      jest.spyOn(service, 'update').mockResolvedValue(mockUpdatedMovie)

      const actualResult = await controller.updateMovie(title, mockUpdatedMovie)

      expect(actualResult.details).toEqual(mockUpdatedMovie)
    })

    it('should handle empty query parameter', async () => {
      const title = ''

      const mockUpdatedMovie: UpdateMovieDto = {
        title: "Titanic",
        codeTitle: "titanic",
        genres: "Drama, Romance, Tragedy",
        duration: "1h 20min",
        rating: "R"
      }

      try {
        await controller.updateMovie(title, mockUpdatedMovie)
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException)
        expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST)
        expect(error.getResponse()).toEqual('empty query parameter')
      }
    })

    it('should handle empty body', async () => {
      const mockUpdatedMovie: UpdateMovieDto = null
      const title = 'abc'

      try {
        await controller.updateMovie(title, mockUpdatedMovie)
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException)
        expect(error.getStatus()).toBe(HttpStatus.UNPROCESSABLE_ENTITY)
        expect(error.getResponse()).toEqual('request body failed to get parsed')
      }
    })
  })

  describe('/deleteOneMovie', () => {
    it('should delete one movie', async () => {
      const mockDeletedMovie: Movie = {
        title: "Titanic",
        codeTitle: "titanic",
        genres: "Drama, Romance, Tragedy",
        duration: "1h 20min",
        rating: "R"
      }
      const title = 'titanic'

      jest.spyOn(service, 'removeOne').mockResolvedValue(mockDeletedMovie)

      const actualResult = await controller.delete(title)

      expect(actualResult.details).toEqual(mockDeletedMovie)
    })
  })
});
