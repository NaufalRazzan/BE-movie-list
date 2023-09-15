import { Test, TestingModule } from "@nestjs/testing"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { InsertUserDto, SignInDto } from "src/models/dto/user.dto"
import { HttpException, HttpStatus } from "@nestjs/common"
import { UsersService } from "src/users/users.service"
import { JwtService } from "@nestjs/jwt"
import { User } from "src/models/entity/user.entity"
import * as bcrypt from "bcrypt";

describe('AuthController', () => {
    let controller: AuthController
    let service: AuthService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: {
                        insertOne: jest.fn(),
                        findUser: jest.fn()
                    }
                },
                {
                    provide: JwtService,
                    useValue: {
                        signAsync: jest.fn().mockImplementation(() => true)
                    }
                },
            ]
        })
        
        .compile()

        controller = module.get<AuthController>(AuthController)
        service = module.get<AuthService>(AuthService)
    })

    it('should be executed', () => {
        expect(controller).toBeDefined()
        expect(service).toBeDefined()
    })

    describe('signup', () => {
        it('should create a new user with valid input', async () => {
            const insertUserDto: InsertUserDto = {
                username: 'testuser',
                email: 'test@email.com',
                role: 'user',
                password: 'password'
            }

            const expectedResult: User = {
                id: 1,
                name: 'testuser',
                email: 'test@email.com',
                role: 'user',
                password: await bcrypt.hash('password', 10)
            }

            jest.spyOn(service, 'signup').mockResolvedValue(expectedResult)
            const actualResult = await controller.signup(insertUserDto)

            expect(actualResult.message).toEqual('new user created')
            expect(actualResult.data).toEqual(expectedResult)
        })

        it('should handle missing fields in the request body', async () => {
            const insertUserDto: InsertUserDto = {
                username: "",
                email: "",
                role: "",
                password: ""
            }

            try {
                await controller.signup(insertUserDto)
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException)
                expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST)
                expect(error.getResponse()).toEqual('empty request body fields')
            }
        })

        it('should handle invalid input', async () => {
            const insertUserDto: InsertUserDto = null

            try {
                await controller.signup(insertUserDto)
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException)
                expect(error.getStatus()).toBe(HttpStatus.UNPROCESSABLE_ENTITY)
                expect(error.getResponse()).toEqual('request body failed to parsed')
            }
        })

        it('should handle 500 code error from AuthService', async () => {
            const insertUserDto: InsertUserDto = {
                username: 'testuser',
                email: 'test@email.com',
                role: 'user',
                password: 'password'
            }

            const expectedError = new HttpException('test error', HttpStatus.INTERNAL_SERVER_ERROR)

            jest.spyOn(service, 'signup').mockRejectedValue(expectedError)

            try {
                await controller.signup(insertUserDto)
            } catch (error) {
                expect(error).toEqual(expectedError)
            }
        })
    })

    describe('signin', () => {
        it('should sign in a user with valid credentials', async () => {
            const signInDto: SignInDto = {
                email: 'test@example.com',
                password: 'password',
            }
            const expectedResult = {
                token: 'mytoken',
                msg: 'welcome'
            }

            jest.spyOn(service, 'signin').mockResolvedValue(expectedResult)

            const actualResult = await controller.signin(signInDto)

            expect(actualResult).toEqual(expectedResult)
            expect(actualResult.token).toBeDefined()
        })

        it('should return an error when email or password is missing', async () => {
            const signInDto: SignInDto = {
                email: '',
                password: 'password',
            }

            try {
                await controller.signin(signInDto)
                fail('expected an error to be thrown')
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException)
                expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST)
                expect(error.getResponse()).toEqual('empty request body fields')
            }
        })

        it('should return an error when the user is not found', async () => {
            const signInDto: SignInDto = {
                email: 'nonexistent@example.com',
                password: 'password',
            }

            jest.spyOn(service, 'signin').mockRejectedValue(new HttpException('incorrect email or password', HttpStatus.UNAUTHORIZED))
        
            try {
                await controller.signin(signInDto)
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException)
                expect(error.getStatus()).toBe(HttpStatus.UNAUTHORIZED)
                expect(error.getResponse()).toEqual('incorrect email or password')
            }
        })
    })
})