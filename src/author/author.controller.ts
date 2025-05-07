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
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorService.create(createAuthorDto);
  }

  @Get()
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Ism bo‘yicha qidiruv (firsName)',
  })
  @ApiQuery({
    name: 'year',
    required: false,
    type: Number,
    description: 'Tug‘ilgan yil bo‘yicha filter',
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
    example: 1,
    description: 'Sahifa raqami',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Sahifadagi elementlar soni',
  })
  findAll(@Query() query: any) {
    return this.authorService.findAll(query);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthorDto: UpdateAuthorDto) {
    return this.authorService.update(+id, updateAuthorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authorService.remove(+id);
  }
}
