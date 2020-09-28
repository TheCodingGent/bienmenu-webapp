import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import {
  trigger,
  state,
  style,
  transition,
  useAnimation,
} from '@angular/animations';
import { Router } from '@angular/router';
import { fadeIn, fadeInDown } from 'ng-animate';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('fadeIn', [
      state(
        'void',
        style({
          opacity: 0,
        })
      ),
      transition('void => *', useAnimation(fadeIn)),
    ]),
    trigger('fadeInDown', [
      state(
        'void',
        style({
          opacity: 0,
        })
      ),
      transition('void => *', useAnimation(fadeInDown)),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;

  constructor(
    private tokenStorageService: TokenStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
  }

  goToPricing() {
    this.router.navigate(['/pricing-plans']);
  }
}
