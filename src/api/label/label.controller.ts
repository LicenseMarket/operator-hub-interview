import {
    Controller,
    Get,
    Post
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiTags
} from '@nestjs/swagger';
import { LabelService } from './label.servie';

@Controller('label')
@ApiTags('labels')
@ApiBearerAuth('access-token')
export class LabelController {
    constructor(private readonly labelService: LabelService) { }

    @Get()
    @ApiOperation({
        summary: 'list label',
        description: 'list label',
        operationId: 'listLabel',
    })
    list() {
        return this.labelService.list();
    }
}