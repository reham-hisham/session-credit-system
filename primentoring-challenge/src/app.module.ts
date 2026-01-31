import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingsModule } from './modules/bookings/bookings.module';
import { UsersModule } from './modules/users/users.module';
import { CreditsModule } from './modules/credits/credits.module';
import { RedisModule } from './redis/redis.module';
import { User } from './modules/users/entities/user.entity';
import { CreditPackage } from './modules/credits/creditPackage/entity/credit-package.entity';
import { UserCredit } from './modules/credits/userCredit/user-credit.entity';
import { CreditTransaction } from './modules/credits/creditTransaction/credit-transaction.entity';
import { Booking } from './modules/bookings/entities/booking.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.get<string>('DB_HOST'),
          port: config.get<number>('DB_PORT'),
          username: config.get<string>('DB_USERNAME'),
          password: config.get<string>('DB_PASSWORD'),
          database: config.get<string>('DB_DATABASE'),
          entities: [
            User,
            CreditPackage,
            UserCredit,
            CreditTransaction,
            Booking,
          ],
          synchronize: false,
          autoLoadEntities: true,
          migrations: ['dist/database/migrations/*.js'],
          migrationsRun: true,
        };
      },
    }),
    UsersModule,
    BookingsModule,
    CreditsModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
