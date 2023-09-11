import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from 'src/schemas/movie.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class MoviesService {
  constructor(@InjectModel(Movie.name) private movieModel: Model<Movie>) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie>{
    return new this.movieModel(createMovieDto).save();
  }

  async findAll() {
    return this.movieModel.find();
  }

  async findOne(title: string) {
    return this.movieModel.findOne({ title });
  }

  async update(title: string, updateMovieDto: UpdateMovieDto) {
    return this.movieModel.updateOne({title}, {$set:{...updateMovieDto}});
  }

  async remove(title: string) {
    return this.movieModel.deleteOne({ title });
  }
}
