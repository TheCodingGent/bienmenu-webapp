import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  private appConfig: any;

  constructor(private http: HttpClient) {}

  async loadAppConfig() {
    const data = await this.http.get('/assets/config.json').toPromise();
    this.appConfig = data;
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
}
