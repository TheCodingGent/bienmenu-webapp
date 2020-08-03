import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-reset-password',
  templateUrl: './request-reset-password.component.html',
  styleUrls: [
    '../../app.component.css',
    './request-reset-password.component.css',
  ],
})
export class RequestResetPasswordComponent implements OnInit {
  RequestResetForm: FormGroup;
  forbiddenEmails: any;
  errorMessage: string;
  successMessage: string;
  IsvalidForm = true;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.RequestResetForm = new FormGroup({
      email: new FormControl(
        null,
        [Validators.required, Validators.email],
        this.forbiddenEmails
      ),
    });
  }

  RequestResetUser(form) {
    console.log(form);
    if (form.valid) {
      this.IsvalidForm = true;
      this.authService
        .requestResetPassword(this.RequestResetForm.value)
        .subscribe(
          (data) => {
            this.RequestResetForm.reset();
            this.successMessage =
              'Reset password link send to email sucessfully.';
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
    } else {
      this.IsvalidForm = false;
    }
  }
}
