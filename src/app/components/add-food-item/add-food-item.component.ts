import {
  Component,
  OnInit,
  Output,
  ViewChild,
  EventEmitter,
} from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ModalService } from 'src/app/services/modal.service';
import { MustNotBeDuplicateInRestaurant } from 'src/app/helpers/file.validator';

@Component({
  selector: 'app-add-food-item',
  templateUrl: './add-food-item.component.html',
  styleUrls: ['./add-food-item.component.scss'],
})
export class AddFoodItemComponent implements OnInit {
  @Output() closed = new EventEmitter<boolean>();
  @ViewChild('addfooditemmodal') addfooditemmodal;

  id = 'addfooditemmodal'; // modal id used by modal service

  isOperationFailed = false;
  isSubmitted = false;
  foodItemForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.modalService.add(this);

    this.foodItemForm = this.formBuilder.group(
      {
        name: this.formBuilder.control('', Validators.required),
      },
      {
        // validator: MustNotBeDuplicateInRestaurant(
        //   'name',
        //   this.restaurant.menus
        // ),
      }
    );
  }

  ngOnDestroy(): void {
    this.modalService.remove(this.id);
  }

  get f() {
    return this.foodItemForm.controls;
  }

  // open modal
  open(): void {
    this.addfooditemmodal.show();
  }

  // close modal
  close(): void {
    this.foodItemForm.reset();
    this.addfooditemmodal.hide();
    this.closed.emit(true);
  }

  saveFoodItem() {
    this.isSubmitted = true;

    // save the food item to the db
    console.log(this.foodItemForm.value);
  }
}
