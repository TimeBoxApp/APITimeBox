import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  private readonly isProd = process.env.NODE_ENV === 'production';

  getClientUrl(): string {
    if (this.isProd) return 'https://timebox.guru';

    return 'http://localhost:8001';
  }

  getServerUrl(): string {
    if (this.isProd) return 'https://api.timebox.guru';

    const port = process.env.PORT || 3000;

    return `http://localhost:${port}`;
  }
}
