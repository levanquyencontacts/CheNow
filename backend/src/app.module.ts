import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { FileModule } from './modules/files/file.module';
import { ProductModule } from './modules/product/product.module';
import { User } from './modules/user/user.entity';
import { UserModule } from './modules/user/user.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [UserModule, ProductModule, FileModule, UsersModule, CategoriesModule, TypeOrmModule.forRoot({
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
export class AppModule { }
