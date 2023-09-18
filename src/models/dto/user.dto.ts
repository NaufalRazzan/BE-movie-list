import { IsNotEmpty, IsString, IsEmail, validate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class InsertUserDto{
    @ApiProperty({
        description: "Username of a user",
        example: "Nauffal"
    })
    @IsNotEmpty({message: 'username cannot be empty'})
    @IsString({message: `'username' must be type of valid string`})
    username: string

    @ApiProperty({
        description: "Email of a user",
        example: "nauffal@gmail.com"
    })
    @IsNotEmpty({message: 'email cannot be empty'})
    @IsEmail({}, {message: `'email' must be type of valid email`})
    email: string;

    @ApiProperty({
        description: "Role of a user",
        example: "User"
    })
    @IsNotEmpty({message: 'role cannot be empty'})
    @IsString({message: `'role' must be type of valid string`})
    role: string

    @ApiProperty({
        description: "Password of a user",
        example: "password"
    })
    @IsNotEmpty({message: 'password cannot be empty'})
    @IsString({message: `'password' must be type of valid string`})
    password: string;
}

export class SignInDto{
    @ApiProperty({
        description: "Email of a user",
        example: "nauffal@gmail.com"
    })
    @IsNotEmpty({message: 'email cannot be empty'})
    @IsEmail({}, {message: `'email' must be type of valid email`})
    email: string

    @ApiProperty({
        description: "Password of a user",
        example: "password"
    })
    @IsNotEmpty({message: 'password cannot be empty'})
    @IsString({message: `'password' must be type of valid string`})
    password: string
}