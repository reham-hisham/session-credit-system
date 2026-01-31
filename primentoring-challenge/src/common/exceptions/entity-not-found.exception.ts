import { HttpStatus } from '@nestjs/common';

export class EntityNotFoundException extends Error {
  code?: string = 'ENTITY_NOT_FOUND';
  statusCode = HttpStatus.NOT_FOUND;
  constructor(entity: string, criteria?: string, code?: string) {
    super(`${entity} not found${criteria ? `: ${criteria}` : ''}`);
    this.code = code ? code : this.code;
  }
}
