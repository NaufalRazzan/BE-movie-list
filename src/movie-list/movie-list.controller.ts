import { 
    Controller, 
    Post, 
    UsePipes, 
    HttpCode,
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

@ApiBearerAuth()
@ApiResponse({status: 401, description: 'No token'})
@ApiResponse({status: 403, description: 'Wrong role'})
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
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    async create(@Body() createMovieDto: CreateMovieDto){
        try {
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
            if(!result){
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
    async findOne(@Query('title') title: string){
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
    @Put('/updateOneMovie')
    @UsePipes(new ValidationPipe({transform: true}))
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    async update(@Query('title') title: string, @Body() updatedMovie: UpdateMovieDto){
        try {
            if(!title){
                throw new HttpException('empty query parameter', HttpStatus.BAD_REQUEST)
            }

            const result = await this.movieService.update(title, updatedMovie)

            return{
                message: 'updated movie',
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
    @Delete('/deleteOneMovie')
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    async delete(@Query('title') title: string){
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
