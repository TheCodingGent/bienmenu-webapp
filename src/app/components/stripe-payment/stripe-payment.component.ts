import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-stripe-payment',
  templateUrl: './stripe-payment.component.html',
  styleUrls: ['../../app.component.css', './stripe-payment.component.css'],
})
export class StripePaymentComponent
  implements OnDestroy, AfterViewInit, OnInit {
  @Output() token = new EventEmitter<any>();

  @ViewChild('cardInfo') cardInfo: ElementRef;
  @ViewChild('addpaymentmodal') addpaymentmodal;

  card: any;
  cardHandler = this.onChange.bind(this);
  cardError: string;
  priceId: string;

  id = 'addpaymentmodal'; // modal id used by modal service

  constructor(
    private cd: ChangeDetectorRef,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.modalService.add(this);
  }

  ngOnDestroy() {
    if (this.card) {
      // We remove event listener here to keep memory clean
      this.card.removeEventListener('change', this.cardHandler);
      this.card.destroy();

      // remove the modal
      this.modalService.remove(this.id);
    }
  }

  ngAfterViewInit() {
    this.initiateCardElement();
  }

  initiateCardElement() {
    const cardStyle = {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    };
    this.card = elements.create('card', { cardStyle });
    this.card.mount(this.cardInfo.nativeElement);
    this.card.addEventListener('change', this.cardHandler);
  }

  // open modal
  open(): void {
    this.addpaymentmodal.show();
  }

  // close modal
  close(): void {
    this.addpaymentmodal.hide();
  }

  onChange({ error }) {
    if (error) {
      this.cardError = error.message;
    } else {
      this.cardError = null;
    }
    this.cd.detectChanges();
  }

  async createStripeToken() {
    const { token, error } = await stripe.createToken(this.card);
    if (token) {
      this.onSuccess(token);
    } else {
      this.onError(error);
    }
  }

  onSuccess(token) {
    this.token.emit(this.card);
    this.close();
  }

  onError(error) {
    if (error.message) {
      this.cardError = error.message;
    }
  }
}
