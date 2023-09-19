import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateMovieDto {
  @ApiProperty({
    description: "Title of a movie",
    example: "Shrek"
  })
  @IsNotEmpty({message: 'title cannot be empty'})
  @IsString({message: `'title' must be type of valid string`})
  title: string;

  @ApiProperty({
    description: "Genres of a movie",
    example: "Action, Adventure, Comedy"
  })
  @IsNotEmpty({message: 'genre cannot be empty'})
    @IsString({message: `'genre' must be type of valid string`})
  genres: string;

  @ApiProperty({
    description: "Duration of a movie",
    example: "1h 20min"
  })
  @IsNotEmpty({message: 'duration cannot be empty'})
  @IsString({message: `'duration' must be type of valid string`})
  duration: string;

  @ApiProperty({
    description: "Rating of a movie",
    example: "SU"
  })
  @IsNotEmpty({message: 'rating cannot be empty'})
  @IsString({message: `'rating' must be type of valid string`})
  rating: string;
}
