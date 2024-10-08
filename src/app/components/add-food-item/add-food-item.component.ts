import {
  Component,
  OnInit,
  Output,
  ViewChild,
  EventEmitter,
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
import { FormatFilename, GetFileVersion } from 'src/app/helpers/utilities';
import { AppConfigService } from 'src/app/services/app-config.service';

@Component({
  selector: 'app-add-food-item',
  templateUrl: './add-food-item.component.html',
  styleUrls: ['./add-food-item.component.scss'],
})
export class AddFoodItemComponent implements OnInit {
  @Output() closed = new EventEmitter<FoodItem>();
  @ViewChild('addFoodItemModal') addFoodItemModal;

  id = 'addFoodItemModal'; // modal id used by modal service

  currentFoodItem: FoodItem = new FoodItem();
  foodItemForm: FormGroup;
  fileToUpload: File;

  //tag handling start
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: string[] = ['vegetarian', 'spicy'];
  tagsFr: string[] = ['végétarien', 'épicé'];
  //tag handling end

  isOperationFailed = false;
  isSubmitted = false;
  isEditing = false;
  isValidFile = false;
  lang;
  language;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private fileUploadService: FileUploadService,
    private foodItemService: FoodItemService,
    private appCofigService: AppConfigService
  ) {
    this.lang = JSON.parse(localStorage.getItem('languages'));
    this.language = this.lang[0].language;
  }

  ngOnInit() {
    this.modalService.add(this);

    this.foodItemForm = this.formBuilder.group({
      name: this.formBuilder.control('', Validators.required),
      description: this.formBuilder.control(''),
      price: this.formBuilder.control('', [
        Validators.required,
        Validators.pattern('^(\\d+(\\.\\d{0,2})?|\\.?\\d{1,2})$'),
      ]),
      promotionPrice: this.formBuilder.control('', [
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
    this.isValidFile = ValidateFile(files.item(0), 5242880, [
      'jpeg',
      'png',
      'jpg',
    ]);

    if (this.isValidFile) {
      this.fileToUpload = files.item(0);
    }
  }

  buildFoodItem(): void {
    // if not editing generate a new ID for the food item
    if (!this.isEditing)
      this.currentFoodItem._id = new ObjectID().toHexString();

    this.currentFoodItem.name = this.foodItemForm.get('name').value;
    this.currentFoodItem.description = this.foodItemForm.get(
      'description'
    ).value;
    this.currentFoodItem.price = this.foodItemForm.get('price').value;
    this.currentFoodItem.calories = this.foodItemForm.get('calories').value;

    this.currentFoodItem.tags = this.tags;
    this.currentFoodItem.price = this.currentFoodItem.price;
    this.currentFoodItem.promotionPrice = this.currentFoodItem.promotionPrice;

    if (this.fileToUpload) {
      if (this.isEditing) {
        // consider deleting older images when image changes
        // update the version of the image
        this.currentFoodItem.imageFilename = FormatFilename(
          this.currentFoodItem.name,
          GetFileVersion(this.currentFoodItem.imageFilename)
        );
      } else {
        this.currentFoodItem.imageFilename = FormatFilename(
          this.currentFoodItem.name
        );
      }

      // update the image url
      this.currentFoodItem.imageUrl = `${
        this.appCofigService.mainS3BucketUrl
      }foodItems/${this.currentFoodItem._id}/${
        this.currentFoodItem.imageFilename
      }.${this.fileToUpload.name.split('.').pop()}`;
    }
  }

  saveFoodItem(): void {
    this.isSubmitted = true;

    this.buildFoodItem();

    // to-do save the food item to the db
    //console.log(this.currentFoodItem);
    this.foodItemService.addFoodItemForUser(this.currentFoodItem).subscribe(
      (data) => {
        // to-do if food item was added successfully to the db then upload the image file
        // this emits the food item back to the food item manager
        if (this.fileToUpload) {
          this.fileUploadService
            .uploadImage(
              'foodItems',
              this.currentFoodItem._id,
              this.fileToUpload,
              this.currentFoodItem.imageFilename
            )
            .subscribe((data) => {
              this.close();
              this.isSubmitted = false;
            });
        } else {
          this.close();
          this.isSubmitted = false;
        }
      },
      (error) => {
        this.isOperationFailed = true;
      }
    );
  }
}
