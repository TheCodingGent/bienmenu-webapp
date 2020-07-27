import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MustMatch } from 'src/app/helpers/mustmatch.validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['../../app.component.css', './reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  submitted = false;

  errorMessage: string;
  successMessage: string;
  resetToken: null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.route.params.subscribe((params) => {
      this.resetToken = params.token;
      console.log(this.resetToken);
    });
  }

  ngOnInit() {
    this.resetForm = this.formBuilder.group(
      {
        resettoken: [this.resetToken],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validator: MustMatch('newPassword', 'confirmPassword'),
      }
    );
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.resetForm.controls;
  }

  ResetPassword() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.resetForm.invalid) {
      console.log(this.resetForm.value);
      return;
    }

    console.log(this.resetForm.value);

    this.authService.updatePassword(this.resetForm.value).subscribe(
      (data) => {
        this.successMessage = data.message;
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
