import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDto } from './create-movie.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
    @ApiProperty({
        description: "Title of a movie",
        example: "Shrek"
      })
      title: string;

      @ApiProperty({
        description: "Title of a movie but written with no space and lowercase",
        example: "shrek"
      })
      codeTitle: string
    
      @ApiProperty({
        description: "Genres of a movie",
        example: "Action, Adventure, Comedy"
      })
      genres: string;
    
      @ApiProperty({
        description: "Duration of a movie",
        example: "1h 20min"
      })
      duration: string;
    
      @ApiProperty({
        description: "Rating of a movie",
        example: "SU"
      })
      rating: string;
}
