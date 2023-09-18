import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'
import { Model, UpdateWriteOpResult } from 'mongoose';
import { CreateMovieDto } from 'src/models/dto/create-movie.dto';
import { UpdateMovieDto } from 'src/models/dto/update-movie.dto';
import { Movie } from 'src/models/schema/movie.schema';
import { DeleteResult } from 'typeorm/driver/mongodb/typings';
import { HttpException, HttpStatus } from '@nestjs/common'

@Injectable()
export class MovieListService {
    findAllMovies() {
        throw new Error('Method not implemented.');
    }
    constructor(@InjectModel(Movie.name) 
    private readonly movieModel: Model<Movie>,
    ){}

    async create(createMovieDto: CreateMovieDto): Promise<Movie>{
        const movie = new this.movieModel(createMovieDto)
        return await movie.save()
    }

    async findAll(): Promise<Movie[]>{
        return await this.movieModel.find()
    }

    async findOne(title: string): Promise<Movie>{
        const result = await this.movieModel.findOne({ title: title })
        if(!result){
            throw new HttpException('no movie found', HttpStatus.NOT_FOUND)
        }

        return result
    }

    async update(title: string, updatedMovieDto: UpdateMovieDto): Promise<UpdateWriteOpResult>{
        const result = await this.movieModel.updateOne(
            { title: title },
            { $set: {...updatedMovieDto} }
        )
        if(result.modifiedCount == 0){
            throw new  HttpException('no movie found to be updated', HttpStatus.NOT_FOUND)
        }

        return result        
    }

    async removeOne(title: string): Promise<DeleteResult>{
        const result = await this.movieModel.deleteOne({ title: title })
        if(result.deletedCount == 0){
            throw new HttpException('no movie found to be deleted', HttpStatus.NOT_FOUND)
        }

        return result
    }
}
