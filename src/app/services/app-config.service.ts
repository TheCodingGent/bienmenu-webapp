import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  private appConfig: any;

  constructor(private http: HttpClient) {}

  async loadAppConfig() {
    if (environment.production) {
      const data = await this.http
        .get('./assets/config/config.prod.json')
        .toPromise();
      this.appConfig = data;
    } else {
      const data = await this.http
        .get('./assets/config/config.dev.json')
        .toPromise();
      this.appConfig = data;
    }
  }

  get apiBaseUrl() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.apiBaseUrl;
  }

  get menusBaseUrl() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.menusBaseUrl;
  }

  get stripeKey() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.stripeKey;
  }
}
