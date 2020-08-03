import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const PLUS_SUB_KEY = 'auth-plus-sub';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  constructor() {}

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    return JSON.parse(sessionStorage.getItem(USER_KEY));
  }

  public savePlusSubscriptionToken(token: string): void {
    window.sessionStorage.removeItem(PLUS_SUB_KEY);
    window.sessionStorage.setItem(PLUS_SUB_KEY, token);
  }

  public getPlusSubscriptionToken(): string {
    return sessionStorage.getItem(PLUS_SUB_KEY);
  }
}
