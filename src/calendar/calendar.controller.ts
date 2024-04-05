import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Redirect, Req } from '@nestjs/common';

import { CalendarService } from './calendar.service';
import { UserRequest } from '../user/entities/user.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Public } from '../app.controller';
import { ConfigService } from '../config/config.service';

@Controller('calendar')
export class CalendarController {
  constructor(
    private readonly calendarService: CalendarService,

    private readonly configService: ConfigService
  ) {}

  @Get('google')
  async connectCalendar(@Req() request: UserRequest): Promise<{ redirectUrl: string }> {
    return await this.calendarService.getGoogleCalendarRedirectUrl(request.user.userId);
  }

  @Public()
  @Get('google/callback')
  @Redirect()
  async googleCalendarRedirectUrl(@Query('code') code: string, @Query('state') state: string): Promise<any> {
    if (!code || !state) return { url: `${this.configService.getClientUrl()}/settings?connectCalendarSuccess=false` };

    return await this.calendarService.saveGoogleCalendarCredentials(code, state);
  }

  @Delete('google')
  async disconnectGoogleCalendar(@Req() request: UserRequest): Promise<{ statusCode: number }> {
    return await this.calendarService.disconnectGoogleCalendar(request.user.userId);
  }

  @Get('events')
  async getEvents(@Req() request: UserRequest): Promise<any> {
    return await this.calendarService.getCalendarEvents(request.user.userId);
  }

  @Post('event')
  async createEvent(@Req() request: UserRequest, @Body() createEventDto: CreateEventDto): Promise<any> {
    return await this.calendarService.createEvent(request.user.userId, createEventDto);
  }

  @Patch('event/:id')
  async updateEvent(
    @Req() request: UserRequest,
    @Param('id') eventId: string,
    @Body() updateEventDto: UpdateEventDto
  ): Promise<any> {
    return await this.calendarService.updateEvent(request.user.userId, eventId, updateEventDto);
  }
}
