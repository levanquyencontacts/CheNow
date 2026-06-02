import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  index() {
    return this.userService.findAll();
  }

  @Get('/:id')
  find(@Param('id') id: string) {
    return this.userService.find(Number(id));
  }

  @Post()
  create(@Body() user: User) {
    return this.userService.create(user);
  }
  @Put('/:id')
  update(@Param('id') id: string, @Body() user: User) {
    return this.userService.update(Number(id), user);
  }
  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.userService.delete(Number(id));
  }
}
