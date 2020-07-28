import { Component, Input, OnInit } from '@angular/core';
import { PaymentService } from 'src/app/services/payment.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['../../app.component.css', './checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  @Input() customerId: string; // should come from the register form on "next" click
  @Input() customerUsername: string;
  priceId: string;
  stripeToken: any;
  success = false;
  isOperationFailed = false;
  errorMessage: string;

  constructor(
    private paymentService: PaymentService,
    private modalService: ModalService
  ) {}

  ngOnInit() {}

  openModal(id: string) {
    this.modalService.open(id);
  }

  onClosedModal(_) {
    this.ngOnInit();
  }

  onSuccess(token: any) {
    this.success = true;
    this.stripeToken = token;
    console.log(this.stripeToken);
  }

  processPayment() {
    const paymentMethod = this.paymentService.createPaymentMethod(
      this.stripeToken,
      // this.customerUsername
      'John Smith'
    );

    console.log(paymentMethod);

    if (paymentMethod.error) {
      this.handleError(paymentMethod.error);
      return;
    }

    //assume the payment method was created successfully

    if (this.paymentService.isPreviousPaymentAttempted()) {
      // the user's payment did not go through, this is a retry to charge the invoice
      const invoiceId = localStorage.getItem('latestInvoiceId');
      this.paymentService
        .retryInvoiceWithNewPaymentMethod(
          this.customerId,
          paymentMethod.id,
          invoiceId,
          this.priceId
        )
        .subscribe((result) => {
          //handle result here
          console.log(result);
        });
    } else {
      // new payment and subscription
      this.paymentService
        .createSubscription(this.customerId, paymentMethod.id, this.priceId)
        .subscribe((result) => {
          //handle result here
          console.log(result);
        });
    }
  }

  handleError(error: string) {
    this.isOperationFailed = true;
    this.errorMessage = error;
  }
}
