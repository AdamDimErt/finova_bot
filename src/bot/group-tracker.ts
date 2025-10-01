import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectBot } from '@grammyjs/nestjs';
import { Bot, Context } from 'grammy';
import { GroupRegistryService } from './group-registry.service';

@Injectable()
export class GroupTracker implements OnModuleInit {
  private readonly logger = new Logger(GroupTracker.name);

  constructor(
    @InjectBot() private readonly bot: Bot<Context>,
    private readonly registry: GroupRegistryService,
  ) {}

  onModuleInit() {
    // Ловим смену статуса бота в чате: добавили/повысили/удалили
    this.bot.on('my_chat_member', async (ctx) => {
      const upd = ctx.update.my_chat_member!;
      const chat = upd.chat;
      const newStatus = upd.new_chat_member.status; // 'administrator' | 'member' | 'kicked' | ...

      // интересуют только группы/супергруппы
      if (chat.type !== 'group' && chat.type !== 'supergroup') return;

      if (newStatus === 'administrator') {
        // сохраним группу
        this.registry.upsert({
          id: chat.id,
          title: ('title' in chat && chat.title) ? chat.title : String(chat.id),
          type: chat.type,
        });
        this.logger.log(`Saved admin group ${chat.id} (${chat.type})`);
      }

      // если бота выгнали/покинул — убираем
      if (newStatus === 'kicked' || newStatus === 'left') {
        this.registry.remove(chat.id);
        this.logger.log(`Removed group ${chat.id} (${newStatus})`);
      }
    });
  }
}
