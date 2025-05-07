import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }
  @Get()
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Kitob nomi bo‘yicha qidiruv',
  })
  @ApiQuery({
    name: 'authorId',
    required: false,
    type: Number,
    description: 'Muallif ID bo‘yicha filter',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description: 'Saralash maydoni',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    type: String,
    enum: ['asc', 'desc'],
    description: 'Saralash tartibi',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Sahifa raqami',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Sahifadagi elementlar soni',
    example: 10,
  })
  findAll(@Query() query: any) {
    return this.bookService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(+id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookService.remove(+id);
  }
}
