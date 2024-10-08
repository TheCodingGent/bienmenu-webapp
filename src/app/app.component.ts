import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TokenStorageService } from './services/token-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  languages = [];
  constructor(private translate: TranslateService) {
    translate.use(this.translate.getBrowserLang());
    this.languages = [{ language: this.translate.getBrowserLang() }];
    if (localStorage.getItem('languages') === null)
      localStorage.setItem('languages', JSON.stringify(this.languages));
  }

  ngOnInit(): void {}
}
