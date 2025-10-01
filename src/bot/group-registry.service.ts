import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GroupRegistryService {
  constructor(private readonly prisma: PrismaService) {}

  upsert(group: { id: number; title: string; type: string }) {
    return this.prisma.botGroup.upsert({
      where: { id: BigInt(group.id) },
      create: { id: BigInt(group.id), title: group.title, type: group.type as any },
      update: { title: group.title, type: group.type as any },
    });
  }

  async remove(chatId: number) {
    await this.prisma.botGroup.delete({ where: { id: BigInt(chatId) } }).catch(() => null);
  }

  list() {
    return this.prisma.botGroup.findMany({ orderBy: { addedAt: 'desc' } });
  }
}
