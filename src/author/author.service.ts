import { Injectable } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthorService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateAuthorDto) {
    let post = await this.prisma.author.create({ data });
    return post;
  }

  async findAll(query: any) {
    try {
      const {
        search,
        sortBy = 'id',
        sortOrder = 'asc',
        page = 1,
        limit = 10,
        year,
      } = query;

      const skip = (page - 1) * limit;

      const filters: any = {};
      if (search) {
        filters.firsName = { contains: search, mode: 'insensitive' };
      }
      if (year) {
        filters.year = Number(year);
      }

      const authors = await this.prisma.author.findMany({
        where: filters,
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip: Number(skip),
        take: Number(limit),
      });

      const total = await this.prisma.author.count({ where: filters });

      return {
        data: authors,
        meta: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error('Mualliflar ro‘yxatini olishda xatolik yuz berdi');
    }
  }

  async findOne(id: number) {
    let one = await this.prisma.author.findFirst({ where: { id } });
    return one;
  }

  async update(id: number, data: UpdateAuthorDto) {
    let edit = await this.prisma.author.update({ where: { id }, data });
    return edit;
  }

  async remove(id: number) {
    let del = await this.prisma.author.delete({ where: { id } });
    return del;
  }
}
