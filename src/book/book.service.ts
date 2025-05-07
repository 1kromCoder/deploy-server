import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateBookDto) {
    try {
      const author = await this.prisma.author.findFirst({
        where: { id: data.authorId },
      });

      if (!author) {
        throw new NotFoundException('Bunday author mavjud emas');
      }
      const book = await this.prisma.book.create({ data });
      return book;
    } catch (error) {
      throw new InternalServerErrorException(
        'Kitob yaratishda xatolik yuz berdi',
      );
    }
  }

  async findAll(query: any) {
    try {
      const {
        search,
        sortBy = 'id',
        sortOrder = 'asc',
        page = 1,
        limit = 10,
        authorId,
      } = query;

      const skip = (page - 1) * limit;

      const filters: any = {};
      if (search) {
        filters.title = { contains: search, mode: 'insensitive' };
      }
      if (authorId) {
        filters.authorId = Number(authorId);
      }

      const books = await this.prisma.book.findMany({
        where: filters,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          Author: true,
        },
        skip: Number(skip),
        take: Number(limit),
      });

      const total = await this.prisma.book.count({ where: filters });

      return {
        data: books,
        meta: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Kitoblar roʻyxatini olishda xatolik yuz berdi',
      );
    }
  }

  async findOne(id: number) {
    try {
      const book = await this.prisma.book.findFirst({
        where: { id },
        include: { Author: true },
      });
      if (!book) {
        throw new NotFoundException('Kitob topilmadi');
      }
      return book;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Kitobni olishda xatolik yuz berdi',
      );
    }
  }

  async update(id: number, data: UpdateBookDto) {
    try {
      const updated = await this.prisma.book.update({ where: { id }, data });
      return updated;
    } catch (error) {
      throw new InternalServerErrorException(
        'Kitobni yangilashda xatolik yuz berdi',
      );
    }
  }

  async remove(id: number) {
    try {
      const deleted = await this.prisma.book.delete({ where: { id } });
      return deleted;
    } catch (error) {
      throw new InternalServerErrorException(
        'Kitobni oʻchirishda xatolik yuz berdi',
      );
    }
  }
}
