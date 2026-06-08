import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe<T> implements PipeTransform {
  constructor(private readonly schema: ZodSchema<T>) {}

  transform(value: unknown): T {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      const errors: Record<string, string[]> = {};
      result.error.errors.forEach((err) => {
        const path = err.path.join('.') || 'root';
        if (!errors[path]) errors[path] = [];
        errors[path].push(err.message);
      });

      throw new BadRequestException({
        message: 'Erro de validação',
        errors,
      });
    }

    return result.data;
  }
}
