import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreditPackageRepositoryService } from './credit-package.repository';
import { CreditPackage } from './entity/credit-package.entity';
import { RedisService } from '../../../redis/redis.service';

@Injectable()
export class CreditPackageService {
  private readonly CACHE_KEY_ALL = 'credit_packages:all';
  private readonly CACHE_KEY_PREFIX = 'credit_packages:';
  private readonly CACHE_TTL: number;

  constructor(
    private readonly creditPackageRepository: CreditPackageRepositoryService,
    private readonly redisService: RedisService,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    this.CACHE_TTL = Number(
      this.configService.get('CREDIT_PACKAGE_CACHE_TTL') ?? 95600,
    );
  }

  async getAllAcgetActiveCreditPackagestive(): Promise<CreditPackage[]> {
    // Try to get from cache first
    const cached = await this.redisService.getJson<CreditPackage[]>(
      this.CACHE_KEY_ALL,
    );

    if (cached) {
      return cached;
    }

    // Get from DB
    const packages = await this.creditPackageRepository.findAllActive();

    // Cache the result
    await this.redisService.setJson(
      this.CACHE_KEY_ALL,
      packages,
      this.CACHE_TTL,
    );

    return packages;
  }

  async getById(id: string): Promise<CreditPackage | null> {
    const cacheKey = `${this.CACHE_KEY_PREFIX}${id}`;
    const cached = await this.redisService.getJson<CreditPackage>(cacheKey);
    if (cached) {
      return cached;
    }

    // Get from DB
    const pkg = await this.creditPackageRepository.findOne(id);
    if (pkg) {
      // Cache the result
      await this.redisService.setJson(cacheKey, pkg, this.CACHE_TTL);
    }

    return pkg;
  }

  async create(dto: Partial<CreditPackage>): Promise<CreditPackage> {
    const pkg = this.creditPackageRepository.create(dto as CreditPackage);
    const savedPkg = await this.creditPackageRepository.save(pkg);
    // add to cache
    const cacheKey = `${this.CACHE_KEY_PREFIX}${savedPkg.id}`;
    await this.redisService.setJson(cacheKey, savedPkg, this.CACHE_TTL);

    return savedPkg;
  }

  async update(id: string, dto: any): Promise<CreditPackage | null> {
    const pkg = await this.getById(id);
    if (!pkg) {
      return null;
    }

    Object.assign(pkg, dto);
    const updatedPkg = await this.creditPackageRepository.save(pkg);
    // update cache
    const cacheKey = `${this.CACHE_KEY_PREFIX}${id}`;
    await this.redisService.setJson(cacheKey, updatedPkg, this.CACHE_TTL);

    return updatedPkg;
  }

  async delete(id: string): Promise<boolean> {
    const pkg = await this.getById(id);
    if (!pkg) return false;
    await this.creditPackageRepository.remove(pkg);

    // delete cache
    const cacheKey = `${this.CACHE_KEY_PREFIX}${id}`;
    await this.redisService.del(cacheKey);

    return true;
  }
}
