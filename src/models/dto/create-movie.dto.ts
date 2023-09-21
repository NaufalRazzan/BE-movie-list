import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsLowercase, NotContains} from "class-validator";

export class CreateMovieDto {
  @ApiProperty({
    description: "Title of a movie",
    example: "Shrek"
  })
  @IsNotEmpty({message: 'title cannot be empty'})
  @IsString({message: `'title' must be type of valid string`})
  title: string;

  @ApiProperty({
    description: "Title of a movie but written with no space and lowercase",
    example: "shrek"
  })
  @IsString({message: 'code title cannot be empty'})
  @IsLowercase({message: 'code title must be lowercase'})
  @NotContains(' ', {message: 'code title cannot have a whitespace'})
  codeTitle: string

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
