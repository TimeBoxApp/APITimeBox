import { google } from 'googleapis';
import { BadRequestException, Injectable } from '@nestjs/common';

import { PreferencesService } from '../preferences/preferences.service';
import { UserService } from '../user/user.service';
import { ConfigService } from '../config/config.service';

@Injectable()
export class CalendarService {
  constructor(
    private readonly preferencesService: PreferencesService,

    private readonly userService: UserService,

    private readonly configService: ConfigService
  ) {}

  public readonly googleOauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${this.configService.getServerUrl()}/api/calendar/google/callback`
  );

  async getGoogleCalendarRedirectUrl(userId: number): Promise<{ redirectUrl: string }> {
    const scopes = ['https://www.googleapis.com/auth/calendar.events'];
    const state = Buffer.from(JSON.stringify({ userId })).toString('base64');

    const redirectUrl = this.googleOauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
      state
    });

    return { redirectUrl };
  }

  async saveGoogleCalendarCredentials(code: string, state: string) {
    const { userId } = JSON.parse(Buffer.from(state, 'base64').toString('ascii'));
    const {
      tokens: { access_token: accessToken, refresh_token: refreshToken }
    } = await this.googleOauth2Client.getToken(code);

    if (!accessToken || !refreshToken)
      return { url: `${this.configService.getClientUrl()}/settings?connectCalendarSuccess=false` };

    await this.userService.saveGoogleAccessToken(userId, accessToken, refreshToken);

    return { url: `${this.configService.getClientUrl()}/settings?connectCalendarSuccess=true` };
  }

  async disconnectGoogleCalendar(userId: number) {
    const accessToken = await this.preferencesService.getUserGoogleAccessToken(userId);

    if (!accessToken) throw new BadRequestException('User does not have Google Calendar integrated');

    await this.googleOauth2Client.revokeToken(accessToken);

    return await this.preferencesService.removeGoogleAccessToken(userId);
  }

  async getGoogleCalendar(userId: number) {
    const accessToken = await this.preferencesService.getUserGoogleAccessToken(userId);
    const auth = new google.auth.OAuth2();

    auth.setCredentials({ access_token: accessToken });

    return google.calendar({ version: 'v3', auth });
  }

  async getCalendarEvents(userId: number) {
    const calendar = await this.getGoogleCalendar(userId);
    const { timeMin, timeMax } = this.getMaxAndMinTimeRange();

    const { data } = await calendar.events.list({
      calendarId: 'primary',
      timeMin: timeMin,
      timeMax: timeMax,
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime'
    });

    const { items } = data;

    if (!items) return [];

    return items.map((event) => {
      return {
        id: event.id,
        title: event.summary,
        start: event.start,
        end: event.end
      };
    });
  }

  async createEvent(userId: number, event: any) {
    const calendar = await this.getGoogleCalendar(userId);
    const eventToCreate = {
      summary: event.title,
      source: { title: 'Timebox', url: this.configService.getClientUrl() },
      start: { dateTime: event.start },
      end: { dateTime: event.end }
    };

    const { data } = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: eventToCreate
    });

    return { id: data.id };
  }

  async updateEvent(userId: number, eventId: string, eventData: any) {
    const calendar = await this.getGoogleCalendar(userId);
    const eventToUpdate = {
      start: { dateTime: new Date(eventData.start).toISOString() },
      end: { dateTime: new Date(eventData.end).toISOString() }
    };

    return await calendar.events.patch({
      calendarId: 'primary',
      eventId: eventId,
      requestBody: eventToUpdate
    });
  }

  getMaxAndMinTimeRange(): { timeMin: string; timeMax: string } {
    const today = new Date();
    const startDate = new Date();
    const endDate = new Date();

    startDate.setMonth(today.getMonth() - 1);
    endDate.setMonth(today.getMonth() + 1);

    const timeMin = startDate.toISOString();
    const timeMax = endDate.toISOString();

    return { timeMin, timeMax };
  }
}
