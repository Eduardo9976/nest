import {Controller, Get, Inject} from '@nestjs/common';
import { AppService } from './app.service';
import globalConfig from "../global-config/global.config";
import {ConfigType} from "@nestjs/config";

@Controller()
export class AppController {
  constructor(
      private readonly appService: AppService,

      @Inject(globalConfig.KEY)
      private readonly globalConfigurations: ConfigType<typeof globalConfig>
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
