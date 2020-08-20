import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css'],
})
export class SuccessComponent implements OnInit {
  constructor(
    private router: Router,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.goToLogin();
    }, 5000);
  }

  goToLogin() {
    if (this.tokenStorageService.getUser) {
      this.tokenStorageService.signOut();
    }

    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }
}
