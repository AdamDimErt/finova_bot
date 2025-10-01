import { Update, Start, Help, Ctx, Hears } from '@grammyjs/nestjs';
import { Context } from 'grammy';
import { GroupRegistryService } from './group-registry.service';
// (опционально) можно импортнуть тип из Prisma, если захочешь аннотировать items:
import { BotGroup } from '@prisma/client';

@Update()
export class BotUpdate {
  constructor(private readonly registry: GroupRegistryService) {}

  @Start()
  async onStart(@Ctx() ctx: Context) {
    await ctx.reply('Привет! Я сохраняю группы, где меня добавили админом. ✌️');
  }

  @Help()
  async onHelp(@Ctx() ctx: Context) {
    await ctx.reply('/groups — показать сохранённые группы');
  }

  // /groups — покажем список
  @Hears(/^\/groups(@\w+)?$/)
  async onGroups(@Ctx() ctx: Context) {
    // ✅ ВАЖНО: теперь list() асинхронный — ждём результат
    const items /* : BotGroup[] */ = await this.registry.list();

    if (!items.length) {
      return ctx.reply('Пока нет сохранённых групп.');
    }

    const text = items
      .map((g) => {
        // g.id — BigInt в Prisma-клиенте; приводим к строке для красоты
        const idStr = g.id.toString();
        return `• ${g.title} (id: <code>${idStr}</code>)`;
      })
      .join('\n');

    await ctx.reply(`<b>Группы, где бот админ:</b>\n${text}`, { parse_mode: 'HTML' });
  }
}
