import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss'],
})
export class SuccessComponent implements OnInit {
  constructor(
    private router: Router,
    private tokenStorageService: TokenStorageService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.updateUserCustomerId();
    setTimeout(() => {
      this.goToLogin();
    }, 5000);
  }

  updateUserCustomerId() {
    console.log('Updating customer Id');
    this.userService.updateUserCustomerId().subscribe(
      (data) => {
        console.log(data);
      },
      (err) => {
        console.log(err);
      }
    );
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
