import { Module } from '@nestjs/common';
import { ListenerModule } from './listener/listener.module';
import { AppConfigModule } from './config/app-config.module';
import { UtilsModule } from './utils/utils.module';
import { AppController } from './app.controller';

@Module({
  imports: [ListenerModule, AppConfigModule, UtilsModule],
  controllers: [AppController],
})
export class AppModule {}
