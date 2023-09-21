import { IsLowercase, IsNotEmpty, IsString, NotContains } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMovieDto {
  @ApiProperty({
    description: "Title of a movie",
    example: "Shrek"
  })
  @IsNotEmpty({message: 'title cannot be empty'})
  @IsString({message: `'title' must be type of valid string`})
  title: string;

  @IsString({message: 'code title cannot be empty'})
  @IsLowercase({message: 'code title must be lowercase'})
  @NotContains(' ', {message: 'code title cannot have a whitespace'})
  codeTitle: string

  @ApiProperty({
    description: "Genres of a movie",
    example: "Action, Adventure, Comedy"
  })

  @IsString({message: 'genres must be a type of string'})
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

  @IsString({message: 'rating must be a type of string'})
  rating: string;
}
