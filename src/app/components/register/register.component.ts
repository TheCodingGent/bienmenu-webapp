import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PaymentService } from '../../services/payment.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MustMatch } from 'src/app/helpers/mustmatch.validator';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from 'src/app/services/app-config.service';

declare var Stripe;

const freePlans = ['basic', 'contact-tracing'];

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../../app.component.scss', './register.component.scss'],
})
export class RegisterComponent implements OnInit {
  stripe: any;
  user: any;

  registerForm: FormGroup;
  selectedPlan: string;

  isSubmitted = false;
  isSignupSuccessful = false;
  isSignupFailed = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private paymentService: PaymentService,
    private appConfig: AppConfigService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.stripe = Stripe(this.appConfig.stripeKey);

    this.selectedPlan = this.route.snapshot.paramMap.get('plan');

    this.registerForm = this.formBuilder.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        terms: [false, Validators.requiredTrue],
      },
      {
        validator: MustMatch('password', 'confirmPassword'),
      }
    );
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  processPayment(): void {
    this.paymentService
      .getPaymentSession(this.selectedPlan, this.f.email.value)
      .subscribe((data) => {
        const session = JSON.parse(data.session);
        console.log(session.id);

        this.stripe
          .redirectToCheckout({ sessionId: session.id })
          .then((res) => {
            console.log(res);
          })
          .catch((error) => {
            console.log(error);
          });
      });
  }

  createUserObject(): void {
    this.user = this.registerForm.value;
    this.user.plan = this.selectedPlan;
  }

  onSubmit(): void {
    this.isSubmitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.createUserObject();

    this.authService.register(this.user).subscribe(
      (_) => {
        if (freePlans.includes(this.selectedPlan)) {
          this.isSignupSuccessful = true;
          this.isSignupFailed = false;
          this.router.navigate(['/login']).then(() => {
            window.location.reload();
          });
          return;
        }
        this.processPayment();
      },
      (err) => {
        this.errorMessage = err.error.message;
        this.isSignupFailed = true;
      }
    );
  }
}
