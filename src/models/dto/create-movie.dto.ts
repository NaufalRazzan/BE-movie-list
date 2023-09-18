import { ApiProperty } from "@nestjs/swagger";

export class CreateMovieDto {
  @ApiProperty({
    description: "Title of a movie",
    example: "Shrek"
  })
  title: string;

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
