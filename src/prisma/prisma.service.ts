import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit,OnModuleDestroy {


    private readonly logger = new Logger(PrismaService.name);
    async onModuleInit() {

        this.logger.log('initializing database connection...');

        try{
            await this.$connect();
             this.logger.log('database connection established successfully');
        }catch(error){
            this.logger.error('failed to connect to database',error);
           throw error
        }
    }

    async onModuleDestroy() {

        await this.$disconnect();
    }
}
