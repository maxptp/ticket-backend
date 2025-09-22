import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TicketPriority } from '../../model/ticket.entity';

export class CreateTicketDto {
  @IsString()
  @MinLength(5, { message: 'title must be at least 5 characters long' })
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000, { message: 'description must not exceed 5000 characters' })
  description?: string;

  @IsEnum(TicketPriority, {
    message: 'priority must be one of: LOW, MEDIUM, HIGH',
  })
  priority: TicketPriority;
}
