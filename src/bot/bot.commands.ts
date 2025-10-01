import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectBot } from '@grammyjs/nestjs';
import { Bot, Context } from 'grammy';

@Injectable()
export class BotCommands implements OnModuleInit {
  constructor(@InjectBot() private readonly bot: Bot<Context>) {}

  async onModuleInit() {
    // Команды по умолчанию (везде)
    await this.bot.api.setMyCommands([
      { command: 'start', description: 'Начать' },
      { command: 'help', description: 'Помощь' },
      { command: 'groups', description: 'Список групп (для админов)' },
    ]);

    // Команды для групп отдельно (необязательно, но удобно)
    await this.bot.api.setMyCommands(
      [
        { command: 'groups', description: 'Показать все группы, где бот админ' },
      ],
      { scope: { type: 'all_group_chats' } },
    );

    // Кнопка меню → показать список команд
    await this.bot.api.setChatMenuButton({
      menu_button: { type: 'commands' },
    });
  }
}
