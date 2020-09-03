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
import { CheckboxComponent, ModalOptions } from 'angular-bootstrap-md';

@Component({
  selector: 'app-contact-tracing',
  templateUrl: './contact-tracing.component.html',
  styleUrls: ['./contact-tracing.component.scss'],
})
export class ContactTracingComponent implements OnInit {
  @Input() province: string;
  @Output() closed = new EventEmitter<boolean>();
  @ViewChild('contacttracingmodal') contacttracingmodal;

  id = 'contacttracingmodal'; // modal id used by modal service
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
      Validators.required,
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
    this.contacttracingmodal.show();
  }

  // close modal
  close(): void {
    var timeout = 0;
    if (this.isSubmitted && !this.isOperationFailed) {
      timeout = 3000;
    }
    setTimeout(() => {
      this.customerForm.reset();
      this.contacttracingmodal.hide();
      this.closed.emit(true);
    }, timeout);
  }

  saveCustomer() {
    this.isSubmitted = true;

    this.customer = this.customerForm.value;
    this.customer.date = new Date().toISOString();
    this.customer.restaurant = this.restaurantId;

    console.log(this.customer);

    this.customerService.addCustomer(this.customer).subscribe(
      (data) => {
        console.log(data);
        this.close();
      },
      (error) => {
        console.log(error);
        this.isOperationFailed = true;
      }
    );
  }
}
