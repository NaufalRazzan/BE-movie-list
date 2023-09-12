import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/entity/user.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieListModule } from './movie-list/movie-list.module';
import { Movie, MovieSchema } from './models/schema/movie.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.POSTGRES_URL,
      entities: [User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    MongooseModule.forFeature([{
      name: Movie.name, 
      schema: MovieSchema
    }]),
    AuthModule,
    UsersModule,
    MovieListModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
