import { google } from 'googleapis';
import { Repository } from 'typeorm';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Preferences } from './entities/preferences.entity';
import { UpdatePreferenceDto } from './dto/update-preference.dto';

@Injectable()
export class PreferencesService {
  constructor(
    @InjectRepository(Preferences)
    private preferencesRepository: Repository<Preferences>
  ) {}

  async create(userId: number): Promise<Preferences> {
    const preferences = new Preferences();

    preferences.userId = userId;

    return await this.preferencesRepository.save(preferences);
  }

  async findCustomerPreferences(userId: number): Promise<Preferences | null> {
    return await this.preferencesRepository.findOne({
      where: { userId },
      select: {
        isPomodoroEnabled: true,
        toDoColumnName: true,
        inProgressColumnName: true,
        doneColumnName: true
      }
    });
  }

  async update(userId: number, updatePreferenceDto: UpdatePreferenceDto): Promise<object> {
    await this.preferencesRepository.update({ userId }, updatePreferenceDto);

    return { statusCode: HttpStatus.OK };
  }

  public async removeGoogleAccessToken(userId: number): Promise<any> {
    const preferences = await this.preferencesRepository.findOne({
      where: { userId },
      select: {
        id: true
      }
    });

    if (!preferences) return null;

    await this.preferencesRepository.update(userId, {
      googleAccessToken: null,
      googleRefreshToken: null,
      googleAccessTokenUpdatedAt: null,
      isCalendarConnected: false
    });

    return { statusCode: HttpStatus.OK };
  }

  public async getUserGoogleAccessToken(userId: number): Promise<string | null> {
    const preferences = await this.preferencesRepository.findOne({
      where: { userId },
      select: {
        id: true,
        googleAccessToken: true,
        googleAccessTokenUpdatedAt: true,
        googleRefreshToken: true
      }
    });

    if (!preferences) return null;

    const { googleAccessTokenUpdatedAt, googleAccessToken, googleRefreshToken } = preferences;

    if (!googleAccessTokenUpdatedAt || !googleRefreshToken) return null;

    let token: string | null = googleAccessToken;

    if (this.isTokenExpired(googleAccessTokenUpdatedAt))
      token = await this.refreshAccessToken(userId, googleRefreshToken);

    return token;
  }

  isTokenExpired(generationTimestamp: Date): boolean {
    const currentTime = new Date().getMilliseconds();
    const generatedAt = generationTimestamp.getMilliseconds();
    const oneHourInMilliseconds = 3600000; // 1 hour = 3600000 milliseconds

    return currentTime - generatedAt < oneHourInMilliseconds;
  }

  async refreshAccessToken(userId: number, refreshToken: string): Promise<string | null> {
    const auth = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, '');

    auth.setCredentials({ refresh_token: refreshToken });

    const {
      credentials: { access_token }
    } = await auth.refreshAccessToken();

    if (!access_token) return null;

    await this.preferencesRepository.update(userId, {
      googleAccessToken: access_token,
      googleAccessTokenUpdatedAt: new Date()
    });

    return access_token;
  }
}
