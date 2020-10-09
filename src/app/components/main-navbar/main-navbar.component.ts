import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { NavbarService } from 'src/app/services/navbar.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-main-navbar',
  templateUrl: './main-navbar.component.html',
  styleUrls: ['./main-navbar.component.scss'],
})
export class MainNavbarComponent implements OnInit {
  roles: string[];
  username: string;
  lang: any;
  language = '';
  plan: string;

  isLoggedIn = false;
  showAdminBoard = false;

  constructor(
    private tokenStorageService: TokenStorageService,
    public navbarService: NavbarService,
    private translate: TranslateService
  ) {
    this.lang = JSON.parse(localStorage.getItem('languages'));
    if (this.lang !== null) this.language = this.lang[0].language;
    console.log(this.language);
  }

  useLanguageButton() {
    if (this.language === 'en') {
      this.translate.use('fr');
      this.lang[0].language = 'fr';
      localStorage.setItem('languages', JSON.stringify(this.lang));
    } else if (this.language === 'fr') {
      this.translate.use('en');
      this.lang[0].language = 'en';
      localStorage.setItem('languages', JSON.stringify(this.lang));
    }
    this.lang = JSON.parse(localStorage.getItem('languages'));
    this.language = this.lang[0].language;
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }

  ngOnInit(): void {
    this.translate.use(this.language);
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.username = user.username;
    }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
