import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MoviesModule, MongooseModule.forRoot('mongodb+srv://userDB:12345Be@cluster0.tuqwoui.mongodb.net/')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
