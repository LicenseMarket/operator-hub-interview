import { Injectable } from "@nestjs/common";
import { PaginationService } from "src/common/pagination/service/create.service";
import { PrismaService } from "src/prisma/service/prisma.service";

@Injectable()
export class LabelService {

    constructor(
        protected prisma: PrismaService,
    ) { }

    async list() {
        return await this.prisma.getClient().label.findMany({});
    }

}