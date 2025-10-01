import { Controller, Get } from '@nestjs/common';
import { GroupRegistryService } from './group-registry.service';

@Controller('bot')
export class BotController {
  constructor(private readonly registry: GroupRegistryService) {}

  @Get('groups')
  list() {
    return this.registry.list();
  }
}
