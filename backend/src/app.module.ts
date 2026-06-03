import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { User } from './modules/user/user.entity';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { FileModule } from './modules/files/file.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [UserModule, CategoryModule,ProductModule,FileModule,UsersModule, TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: '123456',
  database: 'chenow',
  autoLoadEntities: true,
  synchronize: true,
  entities: [User],
}), UsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
