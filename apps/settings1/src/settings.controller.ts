import { Authentication } from '@nestjs-cognito/auth';
import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { SettingsService } from './settings.service';

@Controller()
@ApiTags('Settings')
@ApiBearerAuth()
@Authentication()
// @Authorization({ allowedGroups: [IUserRole.ADMIN] })
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get('/')
  async foo() {
    return 'bar';
  }
}
