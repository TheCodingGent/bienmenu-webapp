import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ModalService } from 'src/app/services/modal.service';
import { CustomerService } from 'src/app/services/customer.service';
import { Customer } from '../../models/customer';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contact-tracing',
  templateUrl: './contact-tracing.component.html',
  styleUrls: ['./contact-tracing.component.scss'],
})
export class ContactTracingComponent implements OnInit {
  @Input() province: string;
  @Output() closed = new EventEmitter<boolean>();
  @ViewChild('contactTracingModal') contactTracingModal;

  id = 'contactTracingModal'; // modal id used by modal service
  customer: Customer;
  restaurantId: string;

  isOperationFailed = false;
  isValidFile = false;
  isSubmitted = false;
  customerForm: FormGroup;
  fullname: FormControl;
  email: FormControl;
  phone: FormControl;
  subscribed: FormControl;
  terms: FormControl;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.modalService.add(this);

    this.restaurantId = this.route.snapshot.paramMap.get('id');

    this.fullname = this.formBuilder.control('', Validators.required);
    this.email = this.formBuilder.control('', [
      Validators.required,
      Validators.email,
    ]);
    this.phone = this.formBuilder.control('', [
      Validators.pattern('^[0-9]{10,10}$'),
    ]);
    this.subscribed = new FormControl(false);
    this.terms = new FormControl(false, Validators.requiredTrue);

    this.customerForm = this.formBuilder.group({
      fullname: this.fullname,
      email: this.email,
      phone: this.phone,
      subscribed: this.subscribed,
      terms: this.terms,
    });
  }

  ngOnDestroy(): void {
    this.modalService.remove(this.id);
  }

  // open modal
  open(): void {
    this.contactTracingModal.show();
  }

  // close modal
  close(): void {
    this.customerForm.reset();
    this.contactTracingModal.hide();
    this.closed.emit(this.isSubmitted);
  }

  saveCustomer() {
    this.isSubmitted = true;

    this.customer = this.customerForm.value;
    this.customer.date = new Date().toISOString();
    this.customer.restaurant = this.restaurantId;

    this.customerService.addCustomer(this.customer).subscribe(
      (_) => {
        this.close();
        this.isSubmitted = false;
      },
      (error) => {
        console.log(error);
        this.isSubmitted = false;
        this.isOperationFailed = true;
      }
    );
  }
}
