import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ConversationPaginationDto,
  SendConversationMessageDto,
  SendCustomerMessageDto,
  UpdateConversationTitleDto,
} from './dto/conversations.dto';
import { ConversationsService } from './conversations.service';
import { JwtAuthGuard } from '../../guards/jwtauth.guath';
import { Users } from '../users/users.entities';

interface AuthRequest {
  user: Users;
}

@UseGuards(JwtAuthGuard)
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

  @Post('customer-message')
  sendCustomerMessage(
    @Body() body: SendCustomerMessageDto,
    @Request() request: AuthRequest,
  ) {
    return this.conversationsService.sendCustomerMessage(request.user, body);
  }

  @Post(':id/messages')
  sendMessage(
    @Param('id') id: string,
    @Body() body: SendConversationMessageDto,
    @Request() request: AuthRequest,
  ) {
    return this.conversationsService.sendMessage(
      Number(id),
      request.user,
      body,
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
