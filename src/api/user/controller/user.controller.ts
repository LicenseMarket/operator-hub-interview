import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common'
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger'
import { PaginationQueryDto } from 'src/common/pagination/dto/query.dto'
import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateUserDto } from '../dto/update-user.dto'
import { UserEntity } from '../entities/user.entity'
import { UserService } from '../service/user.service'
import { LoginDto } from '../dto/login.dto'
import { Public } from 'src/common/decorator/public-metadata.decorator'
import { GetUser } from 'src/common/decorator/user.decorator'
import { UserInterface } from 'src/common/interfaces/user.interface'
import { RoleDto } from 'src/api/role/dto/role.dto'
import { PublicPermission } from 'src/common/decorator/public-permission-metadata.decorator'

@Controller('operator')
@ApiTags('operators')
@ApiBearerAuth('access-token')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @ApiOperation({
        summary: 'find all user',
        description: 'find all user',
        operationId: 'findAllUser',
    })
    @ApiOkResponse({ type: UserEntity, isArray: true })
    findAll() {
        return this.userService.findAll()
    }

    @Public()
    @PublicPermission()
    @Post('login')
    @ApiOperation({
        summary: 'access token by email and password (login with email: superAdmin@gmail.com and password: 123)',
        description: 'login api for user',
        operationId: 'login',
    })
    login(@Body() loginDto: LoginDto) {
        return this.userService.login(loginDto)
    }
}
