import { Test, TestingModule } from "@nestjs/testing"
import { AuthService } from "./auth.service"
import { getRepositoryToken } from "@nestjs/typeorm"
import { User } from "src/models/entity/user.entity"
import { JwtService } from "@nestjs/jwt"
import { UsersService } from "src/users/users.service"
import * as bcrypt from "bcrypt";
import { QueryFailedError } from "typeorm"
import { HttpException, HttpStatus } from "@nestjs/common"

describe('Auth Service', () => {
    let authService: AuthService
    let userService: UsersService

    const mockAuthRepository = {
        signup: jest.fn(),
        signin: jest.fn()
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
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
                    provide: getRepositoryToken(User),
                    useValue: mockAuthRepository
                },
                {
                    provide: JwtService,
                    useValue: {
                        signAsync: jest.fn().mockImplementation(() => true)
                    }
                }
            ]
        }).compile()

        authService = module.get<AuthService>(AuthService)
        userService = module.get<UsersService>(UsersService)
    })

    it('should be defined', () => {
        expect(authService).toBeDefined()
    })

    describe('signup test', () => {
        it('should create new user', async () => {
            const password = 'mypassword'
            const hashedPassword = await bcrypt.hash(password, 10)

            let user = new User()
            user.name = 'testname'
            user.email = 'test@email.com'
            user.role = 'user'
            user.password = hashedPassword

            jest.spyOn(userService, 'insertOne').mockResolvedValue(user)

            const { name, email, role } = user
            const actualResult = await authService.signup(name, email, role, password)

            expect(actualResult).toEqual(user)
        })

        it('should handle duplicate email or username', async () => {
            jest.spyOn(userService, 'insertOne').mockRejectedValue(
                new QueryFailedError('duplicate key value violates unique constraint', [], 'mocked query')
            )

            const name = 'testname'
            const email = 'existing@email.com'
            const role = 'user'
            const password = 'mypassword'
            
            try {
                await authService.signup(name, email, role, password)
                fail('Expected signup to throw an error')
            } catch (error) {
                expect(error).toBeInstanceOf(QueryFailedError)
                expect(error.message).toContain('mocked query')
                expect(error.message).not.toContain('username or email is already in use')
                expect(error).not.toBeInstanceOf(HttpException)
            }
        })
    })

    describe('signin test', () => {
        it('should sign in a user with valid credentials', async () => {
            const user = new User()
            const password = 'mypassword'
            const hashedPassword = await bcrypt.hash(password, 10)

            user.name = 'testname'
            user.email = 'test@email.com'
            user.role = 'user'
            user.password = hashedPassword

            jest.spyOn(userService, 'findUser').mockResolvedValue(user)

            const email = 'test@email.com'
            const actualResponse = await authService.signin(email, password)

            expect(actualResponse.token).toBeDefined()
            expect(actualResponse.msg).toBe('welcome')
        })

        it('should return an error with incorrect credentials', async () => {
            jest.spyOn(userService, 'findUser').mockResolvedValue(null)

            const email = 'incorrectemail@email.com'
            const password = 'incorrectpassword'

            try {
                await authService.signin(email, password)
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException)
                expect(error.getStatus()).toBe(HttpStatus.UNAUTHORIZED)
                expect(error.getResponse()).toEqual('incorrect email or password')
            }
        })
    })
})