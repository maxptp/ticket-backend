import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TicketPriority, TicketStatus } from '../../model/ticket.entity';

export class UpdateTicketDto {
  @IsOptional()
  @IsString()
  @MinLength(5, { message: 'title must be at least 5 characters long' })
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000, { message: 'description must not exceed 5000 characters' })
  description?: string;

  @IsOptional()
  @IsEnum(TicketPriority, {
    message: 'priority must be one of: LOW, MEDIUM, HIGH',
  })
  priority?: TicketPriority;

  @IsOptional()
  @IsEnum(TicketStatus, {
    message: 'status must be one of: OPEN, IN_PROGRESS, RESOLVED',
  })
  status?: TicketStatus;
}
