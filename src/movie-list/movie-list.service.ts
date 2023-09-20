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
    constructor(@InjectModel(Movie.name) 
    private readonly movieModel: Model<Movie>,
    ){}

    async create(createMovieDto: CreateMovieDto): Promise<Movie>{
        const movie = new this.movieModel(createMovieDto)
        try {
            return await movie.save()
        } catch (error) {
            if(error.code === 11000 && error.keyPattern && error.keyPattern.title === 1){
                throw new HttpException(`movie with the given title '${createMovieDto.title}' already exist`, HttpStatus.CONFLICT)
            }
            throw error
        }
    }

    async findAll(): Promise<Movie[]>{
        return await this.movieModel.find().lean()
    }

    async findOne(title: string): Promise<Movie>{
        const result = await this.movieModel.findOne({ codeTitle: title }).lean()
        if(!result){
            throw new HttpException('no movie found', HttpStatus.NOT_FOUND)
        }

        return result
    }

    async update(title: string, updatedMovieDto: UpdateMovieDto): Promise<UpdateMovieDto>{
        const result = await this.movieModel.findOneAndUpdate(
            { codeTitle: title },
            { $set: {...updatedMovieDto} },
            { new: true }
        ).lean()
        if(!result){
            throw new  HttpException('no movie found to be updated', HttpStatus.NOT_FOUND)
        }

        return result
    }

    async removeOne(title: string): Promise<Movie>{
        const result = await this.movieModel.findOneAndDelete({ codeTitle: title }).lean()
        if(!result){
            throw new HttpException('no movie found to be deleted', HttpStatus.NOT_FOUND)
        }

        return result
    }
}
