import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestjsGrammyModule } from '@grammyjs/nestjs';
import { BotUpdate } from './bot.update';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { BotCommands } from './bot.commands';
import { GroupRegistryService } from './group-registry.service';
import { GroupTracker } from './group-tracker';

@Module({
  imports: [
    ConfigModule,
    NestjsGrammyModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        token: cfg.getOrThrow<string>('TELEGRAM_BOT_TOKEN'),
      }),
    }),
  ],
  controllers: [BotController],
  providers: [BotService, BotUpdate, BotCommands, GroupRegistryService, GroupTracker],
  exports: [BotService],
})
export class BotModule {}
