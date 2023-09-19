import { IsLowercase, IsNotEmpty, IsString, NotContains } from "class-validator";


export class CreateMovieDto {
  @IsString({message: 'title must be a type of string'})
  @IsNotEmpty({message: 'title cannot be empty'})
  title: string;

  @IsString({message: 'code title cannot be empty'})
  @IsLowercase({message: 'code title must be lowercase'})
  @NotContains(' ', {message: 'code title cannot have a whitespace'})
  codeTitle: string

  @IsString({message: 'genres must be a type of string'})
  genres: string;

  @IsString({message: 'duration must be a type of string'})
  duration: string;

  @IsString({message: 'rating must be a type of string'})
  rating: string;
}