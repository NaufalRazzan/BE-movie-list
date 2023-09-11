import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  findAll() {
    return this.moviesService.findAll();
  }

  @Get(':title')
  findOne(@Param('title') title: string) {
    return this.moviesService.findOne(title);
  }

  @Put(':title')
  update(@Param('title') title: string, @Body() updateMovieDto: UpdateMovieDto){
    return this.moviesService.update(title, updateMovieDto);
  }

  @Delete(':title')
  remove(@Param('title') title: string) {
    return this.moviesService.remove(title);
  }
}
