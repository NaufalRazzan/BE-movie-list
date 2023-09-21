import { 
    Controller, 
    Post, 
    UsePipes, 
    HttpStatus, 
    HttpException,
    ValidationPipe, 
    Get,
    Body, 
    Query, 
    Delete, 
    Put,
    UseGuards
} from '@nestjs/common';
import { MovieListService } from './movie-list.service';
import { CreateMovieDto } from 'src/models/dto/create-movie.dto';
import { UpdateMovieDto } from 'src/models/dto/update-movie.dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiTags, ApiBearerAuth, ApiHeader, ApiResponse } from '@nestjs/swagger';
import { Movie } from 'src/models/schema/movie.schema';

@ApiBearerAuth()
@ApiResponse({status: 400, description: 'Please enter by following the example'})
@ApiResponse({status: 401, description: 'No token'})
@ApiTags('CRUD')
@Controller('movie-list')
export class MovieListController {
    constructor(private readonly movieService: MovieListService){}

    @ApiHeader({
        name: 'Role',
        description: 'role must be lowercase',
        required: true
    })
    @Post('/insertOneMovie')
    @ApiResponse({status: 403, description: 'Wrong role'})
    @ApiResponse({status: 404, description: 'No movie found'})
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    async create(@Body() createMovieDto: CreateMovieDto){
        try {
            if(!createMovieDto){
                throw new HttpException('request body failed to get parsed', HttpStatus.UNPROCESSABLE_ENTITY)
            }

            if(!createMovieDto.duration || !createMovieDto.genres || !createMovieDto.rating || !createMovieDto.title || !createMovieDto.codeTitle){
                throw new HttpException('empty request body fields', HttpStatus.BAD_REQUEST)
            }
            const result = await this.movieService.create(createMovieDto)
            
            return{
                message: 'new movie created',
                result: result
            }
        } catch (error) {
            throw error;
        }
    }

    @Get('/fetchAllMovies')
    @UseGuards(AuthGuard)
    async findAll(){
        try {
            const result = await this.movieService.findAll()
            if(!result || !result.length){
                return{
                    message: 'movies empty'
                }
            }

            return{
                message: 'list of all movies',
                details: result
            }
        
        } catch (error) {
            throw error;
        }
    }

    @Get('/fetchOneMovie')
    @UseGuards(AuthGuard)
    async findOne(@Query('codetitle') title: string){
        try {
            if(!title){
                throw new HttpException('empty query parameter', HttpStatus.BAD_REQUEST)
            }

            const result = await this.movieService.findOne(title)

            return{
                message: `movie ${title}`,
                details: result 
            }
        } catch (error) {
            throw error;
        }
    }

    @ApiHeader({
        name: 'Role',
        description: 'role must be lowercase',
        required: true
    })
    @ApiResponse({status: 403, description: 'Wrong role'})
    @ApiResponse({status: 404, description: 'No movie found'})
    @Put('/updateOneMovie')
    @UsePipes(new ValidationPipe({transform: true}))
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    async updateMovie(@Query('codetitle') title: string, @Body() updatedMovie: UpdateMovieDto){
        try {
            if(!title){
                throw new HttpException('empty query parameter', HttpStatus.BAD_REQUEST)
            }

            if(!updatedMovie){
                throw new HttpException('request body failed to get parsed', HttpStatus.UNPROCESSABLE_ENTITY)
            }

            const updatedResult = await this.movieService.update(title, updatedMovie)

            return {
                message: 'updated movie',
                details: updatedResult
            }
            
        } catch (error) {
            throw error;
        }
    }

    @ApiHeader({
        name: 'Role',
        description: 'role must be lowercase',
        required: true
    })
    @Delete('/deleteOneMovie')
    @ApiResponse({status: 403, description: 'Wrong role'})
    @ApiResponse({status: 404, description: 'No movie found'})
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    async delete(@Query('codetitle') title: string){
        try {
            if(!title){
                throw new HttpException('empty query parameter', HttpStatus.BAD_REQUEST)
            }

            const result = await this.movieService.removeOne(title)

            return{
                message: 'deleted movie',
                details: result
            }
        } catch (error) {
            throw error
        }
    }
}
