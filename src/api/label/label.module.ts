import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LabelService } from './label.servie';
import { LabelController } from './label.controller';

@Module({
    imports: [PrismaModule],
    controllers: [LabelController],
    providers: [LabelService],
    exports: [LabelService],
})
export class LabelModule { }