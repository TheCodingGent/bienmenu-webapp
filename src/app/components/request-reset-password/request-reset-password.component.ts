import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-reset-password',
  templateUrl: './request-reset-password.component.html',
  styleUrls: [
    '../../app.component.scss',
    './request-reset-password.component.scss',
  ],
})
export class RequestResetPasswordComponent implements OnInit {
  requestResetForm: FormGroup;
  forbiddenEmails: any;
  errorMessage: string;
  successMessage: string;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.requestResetForm = new FormGroup({
      email: new FormControl(
        null,
        [Validators.required, Validators.email],
        this.forbiddenEmails
      ),
    });
  }

  get f() {
    return this.requestResetForm.controls;
  }

  requestResetUser() {
    if (this.requestResetForm.invalid) {
      return;
    }

    this.authService
      .requestResetPassword(this.requestResetForm.value)
      .subscribe(
        (data) => {
          this.requestResetForm.reset();
          this.successMessage =
            'Reset password link has been sent to your email successfully.';
          setTimeout(() => {
            this.successMessage = null;
            this.router.navigate(['login']);
          }, 3000);
        },
        (err) => {
          if (err.error.message) {
            this.errorMessage = err.error.message;
          }
        }
      );
  }
}
