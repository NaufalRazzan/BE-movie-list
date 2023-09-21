import { Test, TestingModule } from "@nestjs/testing"
import { MovieListService } from "./movie-list.service"
import { Movie, MovieSchema } from "src/models/schema/movie.schema"
import { getModelToken } from "@nestjs/mongoose"
import { CreateMovieDto } from "src/models/dto/create-movie.dto"
import { HttpException, HttpStatus } from "@nestjs/common"
import { UpdateMovieDto } from "src/models/dto/update-movie.dto"

describe('Movie list service', () => {
    let movieListService: MovieListService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MovieListService,
                {
                    provide: getModelToken('Movie'),
                    useValue: MovieSchema
                }
            ]
        }).compile()

        movieListService = module.get<MovieListService>(MovieListService)
    })

    it('should be defined', () => {
        expect(movieListService).toBeDefined()
    })

    describe('create method', () => {
        it('should return new movie list', async () => {
            const createMovieDto: CreateMovieDto = {
                title: 'test movie',
                codeTitle: 'testmovie',
                genres: 'test genres',
                duration: '1h',
                rating: 'OK'   
            }

            jest.spyOn(movieListService, 'create').mockResolvedValue(createMovieDto)

            const actualResult = await movieListService.create(createMovieDto)

            expect(actualResult).toEqual(createMovieDto)
        })

        it('should raise duplicate key error', async () => {
            const createMovieDto: CreateMovieDto = {
                title: 'test movie',
                codeTitle: 'testmovie',
                genres: 'test genres',
                duration: '1h',
                rating: 'OK'
            }

            jest.spyOn(movieListService, 'create').mockImplementation(() => {
                throw new HttpException(`movie with the given title '${createMovieDto.title}' already exists`, HttpStatus.CONFLICT);
            })

            try {
                await movieListService.create(createMovieDto)
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.response).toEqual(`movie with the given title '${createMovieDto.title}' already exists`);
                expect(error.getStatus()).toBe(HttpStatus.CONFLICT);
            }
        })

        it('should handle 500 code error', async () => {
            const createMovieDto: CreateMovieDto = {
              title: 'Test Movie',
              genres: 'Action, Adventure',
              duration: "1h 20min",
              rating: "SU",
              codeTitle: 'testmovie'
            }
      
            const expectedError = new HttpException('test error', HttpStatus.INTERNAL_SERVER_ERROR)
      
            jest.spyOn(movieListService, 'create').mockRejectedValue(expectedError)
      
            try {
              await movieListService.create(createMovieDto)
            } catch (error) {
              expect(error).toEqual(expectedError)
            }
        })
    })

    describe('find all method', () => {
        it('should return all movies in array', async () => {
            const movies = [{
                title: "Titanic",
                codeTitle: "titanic",
                genres: "Drama, Romance, Tragedy",
                duration: "1h 20min",
                rating: "R"
            }]

            jest.spyOn(movieListService, 'findAll').mockResolvedValue(movies)

            const actualResult = await movieListService.findAll()
            expect(actualResult).toBe(movies)
        })

        it('should return empty array of movies', async () => {
            jest.spyOn(movieListService, 'findAll').mockResolvedValue([])

            const actualResult = await movieListService.findAll()

            expect(actualResult).toHaveLength(0) // should return empty array
        })
    })

    describe('find one method', () => {
        it('should return one movie', async () => {
            const mockTitle = "titanic"
            const expectedResult = {
                title: "Titanic",
                codeTitle: "titanic",
                genres: "Drama, Romance, Tragedy",
                duration: "1h 20min",
                rating: "R"
            }

            jest.spyOn(movieListService, 'findOne').mockResolvedValue(expectedResult)
            const actualResult = await movieListService.findOne(mockTitle)

            expect(actualResult).toBe(expectedResult)
        })

        it('should return empty movie', async () => {
            const mockTitle = "titanic"

            jest.spyOn(movieListService, 'findOne').mockResolvedValue(null);

            try {
                await movieListService.findOne(mockTitle);
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.getResponse()).toEqual('no movie found')
                expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
            }
        })
    })

    describe('update method', () => {
        it('should return updated movie list', async () => {
            const mockUpdatedMovie: UpdateMovieDto = {
                title: "Titanic",
                codeTitle: "titanic",
                genres: "Drama, Romance, Tragedy",
                duration: "1h 20min",
                rating: "R"
              }
        
            const title = 'titanic'

            jest.spyOn(movieListService, 'update').mockResolvedValue(mockUpdatedMovie)
            const actualResult = await movieListService.update(title, mockUpdatedMovie)

            expect(actualResult).toBe(mockUpdatedMovie)
        })

        it('should return no movie to be updated', async () => {
            const mockUpdatedMovie: UpdateMovieDto = {
                title: "Titanic",
                codeTitle: "titanic",
                genres: "Drama, Romance, Tragedy",
                duration: "1h 20min",
                rating: "R"
              }
        
            const title = 'titanic'

            jest.spyOn(movieListService, 'update').mockResolvedValue(null);

            try {
                await movieListService.update(title, mockUpdatedMovie);
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.getResponse()).toEqual('no movie found to be updated')
                expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
            }
        })
    })

    describe('delete method', () => {
        it('should return deleted movie list', async () => {
            const mockDeletedMovie: Movie = {
                title: "Titanic",
                codeTitle: "titanic",
                genres: "Drama, Romance, Tragedy",
                duration: "1h 20min",
                rating: "R"
            }
        
            const title = 'titanic'

            jest.spyOn(movieListService, 'removeOne').mockResolvedValue(mockDeletedMovie)
            const actualResult = await movieListService.removeOne(title)

            expect(actualResult).toBe(mockDeletedMovie)
        })

        it('should return empty deleted movie', async () => {
            const title = 'titanic'

            jest.spyOn(movieListService, 'removeOne').mockResolvedValue(null)

            try {
                await movieListService.removeOne(title)
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.getResponse()).toEqual('no movie found to be deleted')
                expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
            }
        })
    })
})