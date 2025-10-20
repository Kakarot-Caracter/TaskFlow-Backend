import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  IsBoolean,
} from 'class-validator';

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

// create-task.dto.ts
export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(Priority)
  priority: Priority;

  @IsDateString()
  dueDate: string; // Cambia a string para aceptar formato ISO

  @IsOptional() // Hacer opcional
  @IsBoolean()
  completed?: boolean = false; // Valor por defecto

  @IsString()
  category: string; // Cambiar nombre a singular
}
