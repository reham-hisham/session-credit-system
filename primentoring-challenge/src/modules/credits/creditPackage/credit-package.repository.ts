import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreditPackage } from './entity/credit-package.entity';

@Injectable()
export class CreditPackageRepositoryService {
  constructor(
    @InjectRepository(CreditPackage)
    private readonly repo: Repository<CreditPackage>,
  ) {}

  async findAll() {
    return await this.repo.find();
  }

  async findOne(id: string) {
    return await this.repo.findOne({ where: { id } });
  }

  create(data: Partial<CreditPackage>) {
    return this.repo.create(data);
  }

  async save(entity: CreditPackage) {
    return await this.repo.save(entity);
  }

  async update(id: string, data: Partial<CreditPackage>) {
    return await this.repo.update(id, data);
  }

  async remove(entity: CreditPackage) {
    return await this.repo.remove(entity);
  }
  async findAllActive() {
    return await this.repo.find({ where: { isActive: true } });
  }
}
