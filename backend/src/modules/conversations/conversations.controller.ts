import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ConversationPaginationDto,
  UpdateConversationTitleDto,
} from './dto/conversations.dto';
import { ConversationsService } from './conversations.service';
import { JwtAuthGuard } from '../../guards/jwtauth.guath';
import { Users } from '../users/users.entities';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleCode } from '../../common/enums/common.enum';

interface AuthRequest {
  user: Users;
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleCode.ADMIN, RoleCode.STAFF, RoleCode.CUSTOMER)
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get()
  findAll(
    @Query() query: ConversationPaginationDto,
    @Request() request: AuthRequest,
  ) {
    return this.conversationsService.findAll(query, request.user);
  }

  @Get(':id')
  findById(@Param('id') id: string, @Request() request: AuthRequest) {
    return this.conversationsService.findById(Number(id), request.user);
  }

  @Get(':id/messages')
  findMessages(
    @Param('id') id: string,
    @Query() query: ConversationPaginationDto,
    @Request() request: AuthRequest,
  ) {
    return this.conversationsService.findMessages(
      Number(id),
      query,
      request.user,
    );
  }

  @Patch(':id/title')
  updateTitle(
    @Param('id') id: string,
    @Body() body: UpdateConversationTitleDto,
    @Request() request: AuthRequest,
  ) {
    return this.conversationsService.updateTitle(
      Number(id),
      request.user,
      body.title,
    );
  }
}
