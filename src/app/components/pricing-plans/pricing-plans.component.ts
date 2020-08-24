import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { PaymentService } from 'src/app/services/payment.service';
import { AppConfigService } from 'src/app/services/app-config.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

declare var Stripe;

@Component({
  selector: 'app-pricing-plans',
  templateUrl: './pricing-plans.component.html',
  styleUrls: ['./pricing-plans.component.scss'],
})
export class PricingPlansComponent implements OnInit {
  stripe: any;
  currentUser: any;

  isLoggedIn = false;
  isPaymentRequestSubmitted = false;
  isPaymentRequestFailed = false;

  constructor(
    private token: TokenStorageService,
    private paymentService: PaymentService,
    private userService: UserService,
    private appConfig: AppConfigService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.stripe = Stripe(this.appConfig.stripeKey);

    this.currentUser = this.token.getUser();
    if (this.currentUser) {
      this.isLoggedIn = true;
    }
  }

  processPayment(plan: string): void {
    this.isPaymentRequestSubmitted = true;
    this.paymentService
      .getPaymentSession(plan, this.currentUser.email)
      .subscribe(
        (data) => {
          const session = JSON.parse(data.session);

          this.stripe
            .redirectToCheckout({ sessionId: session.id })
            .then((result) => {
              if (result.error) {
                console.log(result.error.message);
                this.isPaymentRequestFailed = true;
                this.isPaymentRequestSubmitted = false;
              }
              console.log(result);
            });
        },
        (err) => {
          console.log(err);
          this.isPaymentRequestFailed = true;
          this.isPaymentRequestSubmitted = false;
        }
      );
  }

  handlePlanClicked(plan: string) {
    if (this.isLoggedIn) {
      this.processPayment(plan);
      return;
    }

    this.router.navigate(['/register', { plan: plan }]);
  }
}
