import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { MessageType, Order } from '../../../common/enums/common.enum';

export class ConversationPaginationDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsInt()
  @Min(1)
  @Max(200)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @IsEnum(Order)
  @IsOptional()
  order?: Order = Order.ASC;
}

export class SendConversationMessageDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  conversationId?: number;

  @IsEnum(MessageType)
  @IsOptional()
  type?: MessageType = MessageType.TEXT;

  @IsString()
  @IsOptional()
  content?: string;
}

export class UpdateConversationTitleDto {
  @IsString()
  @IsNotEmpty()
  title: string;
}

export class JoinConversationDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  conversationId: number;
}

export class LeaveConversationDto extends JoinConversationDto {}

export class ReadConversationDto extends JoinConversationDto {}

export class TypingConversationDto extends JoinConversationDto {
  @IsBoolean()
  @IsOptional()
  isTyping?: boolean;
}
