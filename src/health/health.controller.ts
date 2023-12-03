import { Controller, Get } from '@nestjs/common';

import { Public } from '../app.controller';

@Controller('health')
export class HealthController {
  @Get()
  @Public()
  healthCheck(): object {
    return {
      status: 'OK',
      uptime: process.uptime()
    };
  }
}
