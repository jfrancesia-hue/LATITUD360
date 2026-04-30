import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import type { ZodSchema } from "zod";

@Injectable()
export class ZodValidationPipe<T> implements PipeTransform {
  constructor(private readonly schema: ZodSchema<T>) {}
  transform(value: unknown) {
    const r = this.schema.safeParse(value);
    if (!r.success) throw new BadRequestException({ message: "Validation failed", issues: r.error.flatten() });
    return r.data;
  }
}
