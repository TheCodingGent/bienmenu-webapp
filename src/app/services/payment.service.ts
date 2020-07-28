import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private paymentAPI = 'http://localhost:5000/payment';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  isPreviousPaymentAttempted(): boolean {
    // If a previous payment was attempted, get the latest invoice
    const latestInvoicePaymentIntentStatus = localStorage.getItem(
      'latestInvoicePaymentIntentStatus'
    );

    return latestInvoicePaymentIntentStatus === 'requires_payment_method';
  }

  createPaymentMethod(card: any, billingName: string): any {
    // Set up payment method for recurring usage
    console.log(`Billing name ${billingName}`);
    console.log(`Card: ${card}`);

    stripe
      .createPaymentMethod({
        type: 'card',
        card: card,
        billing_details: {
          name: billingName,
        },
      })
      .then((result: any) => {
        return result;
      });
  }

  retryInvoiceWithNewPaymentMethod(
    customerId: string,
    paymentMethodId: string,
    invoiceId: string,
    priceId: string
  ): Observable<any> {
    const body = JSON.stringify({
      customerId: customerId,
      paymentMethodId: paymentMethodId,
      invoiceId: invoiceId,
    });
    return this.http
      .post(this.paymentAPI + '/retry-invoice', body, this.httpOptions)
      .pipe(
        tap((result) => console.log(result)),
        catchError(this.handleError('retryInvoice'))
      );
    //   fetch('/retry-invoice', {
    //     method: 'post',
    //     headers: {
    //       'Content-type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       customerId: customerId,
    //       paymentMethodId: paymentMethodId,
    //       invoiceId: invoiceId,
    //     }),
    //   })
    //     .then((response) => {
    //       return response.json();
    //     })
    //     // If the card is declined, display an error to the user.
    //     .then((result) => {
    //       if (result.error) {
    //         // The card had an error when trying to attach it to a customer
    //         throw result;
    //       }
    //       return result;
    //     })
    //     // Normalize the result to contain the object returned
    //     // by Stripe. Add the addional details we need.
    //     .then((result) => {
    //       return {
    //         // Use the Stripe 'object' property on the
    //         // returned result to understand what object is returned.
    //         invoice: result,
    //         paymentMethodId: paymentMethodId,
    //         priceId: priceId,
    //         isRetry: true,
    //       };
    //     })
    //     // Some payment methods require a customer to be on session
    //     // to complete the payment process. Check the status of the
    //     // payment intent to handle these actions.
    //     .then(this.handlePaymentThatRequiresCustomerAction)
    //     // No more actions required. Provision your service for the user.
    //     .then(this.onSubscriptionComplete) // TO-DO
    //     .catch((error) => {
    //       // An error has happened. Display the failure to the user here.
    //       // We utilize the HTML element we created.
    //       console.log(error); // return error to user
    //     })
    // );
  }

  createSubscription(
    customerId: string,
    paymentMethodId: string,
    priceId: string
  ): Observable<any> {
    const body = JSON.stringify({
      customerId: customerId,
      paymentMethodId: paymentMethodId,
      priceId: priceId,
    });
    return this.http
      .post(this.paymentAPI + '/create-subscription', body, this.httpOptions)
      .pipe(
        tap((result) => console.log(result)),
        catchError(this.handleError('createSubscription'))
      );

    //   fetch('/create-subscription', {
    //     method: 'post',
    //     headers: {
    //       'Content-type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       customerId: customerId,
    //       paymentMethodId: paymentMethodId,
    //       priceId: priceId,
    //     }),
    //   })
    //     .then((response) => {
    //       return response.json();
    //     })
    //     // If the card is declined, display an error to the user.
    //     .then((result) => {
    //       if (result.error) {
    //         // The card had an error when trying to attach it to a customer
    //         throw result;
    //       }
    //       return result;
    //     })
    //     // Normalize the result to contain the object returned
    //     // by Stripe. Add the addional details we need.
    //     .then((result) => {
    //       return {
    //         // Use the Stripe 'object' property on the
    //         // returned result to understand what object is returned.
    //         subscription: result,
    //         paymentMethodId: paymentMethodId,
    //         priceId: priceId,
    //       };
    //     })
    //     // Some payment methods require a customer to do additional
    //     // authentication with their financial institution.
    //     // Eg: 2FA for cards.
    //     .then(this.handlePaymentThatRequiresCustomerAction)
    //     // If attaching this card to a Customer object succeeds,
    //     // but attempts to charge the customer fail. You will
    //     // get a requires_payment_method error.
    //     .then(this.handleRequiresPaymentMethod)
    //     // No more actions required. Provision your service for the user.
    //     .then(this.onSubscriptionComplete) // TO-DO
    //     .catch((error) => {
    //       // An error has happened. Display the failure to the user here.
    //       // We utilize the HTML element we created.
    //       console.log(error); // return error to user
    //     })
    // );
  }

  handleRequiresPaymentMethod({ subscription, paymentMethodId, priceId }) {
    if (subscription.status === 'active') {
      // subscription is active, no customer actions required.
      return { subscription, priceId, paymentMethodId };
    } else if (
      subscription.latest_invoice.payment_intent.status ===
      'requires_payment_method'
    ) {
      // Using localStorage to store the state of the retry here
      // (feel free to replace with what you prefer)
      // Store the latest invoice ID and status
      localStorage.setItem('latestInvoiceId', subscription.latest_invoice.id);
      localStorage.setItem(
        'latestInvoicePaymentIntentStatus',
        subscription.latest_invoice.payment_intent.status
      );
      throw { error: { message: 'Your card was declined.' } };
    } else {
      return { subscription, priceId, paymentMethodId };
    }
  }

  handlePaymentThatRequiresCustomerAction({
    subscription,
    invoice,
    priceId,
    paymentMethodId,
    isRetry,
  }) {
    if (subscription && subscription.status === 'active') {
      // subscription is active, no customer actions required.
      return { subscription, priceId, paymentMethodId };
    }

    // If it's a first payment attempt, the payment intent is on the subscription latest invoice.
    // If it's a retry, the payment intent will be on the invoice itself.
    let paymentIntent = invoice
      ? invoice.payment_intent
      : subscription.latest_invoice.payment_intent;

    if (
      paymentIntent.status === 'requires_action' ||
      (isRetry === true && paymentIntent.status === 'requires_payment_method')
    ) {
      return stripe
        .confirmCardPayment(paymentIntent.client_secret, {
          payment_method: paymentMethodId,
        })
        .then((result) => {
          if (result.error) {
            // start code flow to handle updating the payment details
            // Display error message in your UI.
            // The card was declined (i.e. insufficient funds, card has expired, etc)
            throw result;
          } else {
            if (result.paymentIntent.status === 'succeeded') {
              // There's a risk of the customer closing the window before callback
              // execution. To handle this case, set up a webhook endpoint and
              // listen to invoice.paid. This webhook endpoint returns an Invoice.
              return {
                priceId: priceId,
                subscription: subscription,
                invoice: invoice,
                paymentMethodId: paymentMethodId,
              };
            }
          }
        });
    } else {
      // No customer action needed
      return { subscription, priceId, paymentMethodId };
    }
  }

  onSubscriptionComplete(result) {
    console.log(result);
    // Payment was successful. Provision access to your service.
    // Remove invoice from localstorage because payment is now complete.
    this.clearCache();
    // Change your UI to show a success message to your customer.
    // Call your backend to grant access to your service based on
    // the product your customer subscribed to.
    // Get the product by using result.subscription.price.product
  }

  clearCache() {
    localStorage.clear();
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
