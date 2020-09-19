import {
  Component,
  OnInit,
  Output,
  ViewChild,
  EventEmitter,
  Input,
} from '@angular/core';
import { ObjectID } from 'bson';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ModalService } from 'src/app/services/modal.service';
import { ValidateFile } from 'src/app/helpers/file.validator';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FoodItem } from 'src/app/models/food-item';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { FoodItemService } from 'src/app/services/food-item.service';
import { FormatFilename } from 'src/app/helpers/utilities';

@Component({
  selector: 'app-add-food-item',
  templateUrl: './add-food-item.component.html',
  styleUrls: ['./add-food-item.component.scss'],
})
export class AddFoodItemComponent implements OnInit {
  @Output() closed = new EventEmitter<FoodItem>();
  @ViewChild('addFoodItemModal') addFoodItemModal;

  id = 'addFoodItemModal'; // modal id used by modal service

  currentFoodItem: FoodItem;
  foodItemForm: FormGroup;
  fileToUpload: File;

  //tag handling start
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: string[] = ['vegetarian', 'spicy'];
  //tag handling end

  isOperationFailed = false;
  isSubmitted = false;
  isEditing = false;
  isValidFile = false;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private fileUploadService: FileUploadService,
    private foodItemService: FoodItemService
  ) {}

  ngOnInit() {
    this.modalService.add(this);

    this.foodItemForm = this.formBuilder.group({
      name: this.formBuilder.control('', Validators.required),
      description: this.formBuilder.control(''),
      price: this.formBuilder.control('', [
        Validators.required,
        Validators.pattern('^(\\d+(\\.\\d{0,2})?|\\.?\\d{1,2})$'),
      ]),
      calories: this.formBuilder.control('', [Validators.pattern('^\\d+$')]),
    });
  }

  ngOnDestroy(): void {
    this.modalService.remove(this.id);
  }

  get f() {
    return this.foodItemForm.controls;
  }

  // open modal
  open(): void {
    this.addFoodItemModal.show();
    if (this.isEditing) {
      this.foodItemForm.patchValue({
        name: this.currentFoodItem.name,
        description: this.currentFoodItem.description,
        price: this.currentFoodItem.price,
        calories: this.currentFoodItem.calories,
      });
      this.tags = this.currentFoodItem.tags;
    }
  }

  // close modal
  close(): void {
    this.foodItemForm.reset();
    this.addFoodItemModal.hide();
    this.closed.emit(this.currentFoodItem);

    // to-do reset the input file

    // clear foodItem in addFoodItem modal
    this.currentFoodItem = undefined;
    this.isEditing = false;
  }

  // Handling tags
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add the tag
    if ((value || '').trim()) {
      this.tags.push(value.trim().toLowerCase());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  handleInputFiles(files: FileList) {
    this.isValidFile = ValidateFile(files.item(0), 5242880, ['jpeg', 'png']);

    if (this.isValidFile) {
      this.fileToUpload = files.item(0);
    }
  }

  buildFoodItem(): void {
    let id: string;

    // if not editing generate a new ID for the food item
    if (!this.isEditing) {
      id = new ObjectID().toHexString();
    } else {
      id = this.currentFoodItem._id;
    }

    this.currentFoodItem = this.foodItemForm.value;
    this.currentFoodItem._id = id;

    if (this.fileToUpload) {
      if (this.isEditing && this.currentFoodItem.imageUrl) {
        // the current image has changed and need to delete the current image
      }

      // update the image url
      this.currentFoodItem.imageUrl = FormatFilename(this.currentFoodItem.name);
    }
    this.currentFoodItem.tags = this.tags;
  }

  saveFoodItem(): void {
    this.isSubmitted = true;

    this.buildFoodItem();

    // to-do save the food item to the db
    console.log(this.currentFoodItem);
    this.foodItemService.addFoodItemForUser(this.currentFoodItem).subscribe(
      (data) => {
        // to-do if food item was added successfully to the db then upload the image file
        // this emits the food item back to the food item manager
        this.close();
        this.isSubmitted = false;
      },
      (error) => {
        this.isOperationFailed = true;
      }
    );
  }
}
