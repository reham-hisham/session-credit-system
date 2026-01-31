import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { CreditPackageNotFoundException } from '../../common/exceptions/credit-package-not-found.exception';
import { CreditPackageService } from './creditPackage/credit-package.service';
import { CreditPackage } from './creditPackage/entity/credit-package.entity';
import { ApiTags, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { UserRole } from '../users/entities/user.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateCreditPackageDto } from './creditPackage/dto/create-credit-package.dto';
import { UpdateCreditPackageDto } from './creditPackage/dto/update-credit-package.dto';

@ApiTags('credit-packages')
@ApiBearerAuth('JWT')
@Controller('credit-packages')
export class CreditPackageController {
  constructor(private readonly creditPackageService: CreditPackageService) {}

  @Get()
  async getAll(): Promise<CreditPackage[] | any> {
    try {
      return await this.creditPackageService.getAllAcgetActiveCreditPackagestive();
    } catch (error) {
      console.error('Get all credit packages error:', error);
      return {
        status: error.statusCode || 400,
        code: error.code || 'GET_CREDIT_PACKAGES_ERROR',
        message:
          error.message || 'An error occurred while fetching credit packages',
      };
    }
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: 'string' })
  async getById(@Param('id') id: string): Promise<CreditPackage | any> {
    try {
      const pkg = await this.creditPackageService.getById(id);
      if (!pkg) {
        throw new CreditPackageNotFoundException();
      }
      return pkg;
    } catch (error) {
      console.error('Get credit package by id error:', error);
      return {
        status: error.statusCode || 404,
        code: error.code || 'GET_CREDIT_PACKAGE_ERROR',
        message:
          error.message || 'An error occurred while fetching credit package',
      };
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBody({ type: CreateCreditPackageDto })
  @Roles(UserRole.ADMIN)
  async create(
    @Body() dto: CreateCreditPackageDto,
  ): Promise<CreditPackage | any> {
    try {
      return await this.creditPackageService.create(dto);
    } catch (error) {
      console.error('Create credit package error:', error);
      return {
        status: error.statusCode || 400,
        code: error.code || 'CREATE_CREDIT_PACKAGE_ERROR',
        message:
          error.message || 'An error occurred during credit package creation',
      };
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiParam({ name: 'id', type: 'string' })
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCreditPackageDto,
  ): Promise<CreditPackage | any> {
    try {
      const result = await this.creditPackageService.update(id, dto);
      if (!result) {
        throw new CreditPackageNotFoundException();
      }
      return result;
    } catch (error) {
      console.error('Update credit package error:', error);
      return {
        status: error.statusCode || 400,
        code: error.code || 'UPDATE_CREDIT_PACKAGE_ERROR',
        message:
          error.message || 'An error occurred during credit package update',
      };
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiParam({ name: 'id', type: 'string' })
  @Roles(UserRole.ADMIN)
  async delete(@Param('id') id: string): Promise<void | any> {
    try {
      const deleted = await this.creditPackageService.delete(id);
      if (!deleted) {
        throw new CreditPackageNotFoundException();
      }
    } catch (error) {
      console.error('Delete credit package error:', error);
      return {
        status: error.statusCode || 400,
        code: error.code || 'DELETE_CREDIT_PACKAGE_ERROR',
        message:
          error.message || 'An error occurred during credit package deletion',
      };
    }
  }
}
