import { Module } from '@nestjs/common';
import { MovieListController } from './movie-list.controller';
import { MovieListService } from './movie-list.service';
import { MongooseModule } from '@nestjs/mongoose'
import { Movie, MovieSchema } from 'src/models/schema/movie.schema';
import { APP_FILTER } from '@nestjs/core';
import { UnhandledExceptionFilter } from 'src/filters/UnhandledException.filter';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [ 
    MongooseModule.forFeature([{
      name: Movie.name,
      schema: MovieSchema
  }]),
  ],
  controllers: [
    MovieListController
  ],
  providers: [
    MovieListService,
    {
      provide: APP_FILTER,
      useClass: UnhandledExceptionFilter
    }
  ]
})
export class MovieListModule {}
