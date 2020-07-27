import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { RestaurantService } from '../../services/restaurant.service';
import { FileUploadService } from '../../services/file-upload.service';
import { ObjectID } from 'bson';
import { ValidateFile } from 'src/app/helpers/file.validator';

@Component({
  selector: 'app-add-restaurant',
  templateUrl: './add-restaurant.component.html',
  styleUrls: ['../../app.component.css', './add-restaurant.component.css'],
})
export class AddRestaurantComponent implements OnInit {
  restaurantForm: FormGroup;
  menus: FormArray;
  menuFiles: Array<File>;
  isInvalidFile = false;

  constructor(
    private formBuilder: FormBuilder,
    private restaurantService: RestaurantService,
    private fileUploadService: FileUploadService
  ) {}

  ngOnInit() {
    this.menuFiles = new Array();
    this.restaurantForm = this.formBuilder.group({
      _id: [new ObjectID()],
      name: ['', Validators.required],
      city: [
        '',
        [
          Validators.required,
          Validators.pattern('^([A-Z][a-z]*((\\s[A-Za-z])?[a-z]*)*)$'), // check if only first letter is capital
        ],
      ],
      address: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^[0-9]{1,5}[,\\s].*[,\\s](([A-Z][0-9][A-Z]\\s{0,1}[0-9][A-Z][0-9])|([0-9]{5}))$' // ensure address starts with numbers and ends with a zipcode
          ),
        ],
      ],
      menus: this.formBuilder.array([this.createMenu()]),
      rating: [
        '',
        [Validators.required, Validators.pattern('^[0-9][.][0-9]$')], // make sure this is in the format of digit.digit
      ],
      color: [
        '',
        [Validators.required, Validators.pattern('^[#][a-z0-9]{6}$')], // ensure color starts with # and has 6 characters
      ],
    });
  }

  createMenu(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      filename: ['', [Validators.required, Validators.pattern('^[a-z_]+$')]], // must be all small letters and only contain letters and underscores
      lastupdated: [new Date().toISOString()],
    });
  }

  addMenu(): void {
    this.menus = this.restaurantForm.get('menus') as FormArray;
    this.menus.push(this.createMenu());
  }

  deleteMenu(index: number): void {
    this.menus = this.restaurantForm.get('menus') as FormArray;
    this.menus.removeAt(index);
    this.menuFiles.splice(index, 1);
  }

  handleInputFiles(files: FileList, index: number) {
    this.isInvalidFile = ValidateFile(files.item(0), 5242880, ['pdf']);

    if (!this.isInvalidFile) {
      this.menuFiles.push(files.item(0));
    }
  }

  uploadFileToServer(fileToUpload: File, index: number) {
    let menus = this.restaurantForm.get('menus') as FormArray;
    this.fileUploadService
      .postFile(
        fileToUpload,
        this.restaurantForm.get('_id').value,
        menus.at(index).get('filename').value // set the file name to the one entered in the filename field
      )
      .subscribe(
        (data) => {
          console.log(data);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.log(this.restaurantForm.value);

    //upload the files
    for (let [i, file] of this.menuFiles.entries()) {
      console.log(file.name);
      this.uploadFileToServer(file, i);
    }

    this.restaurantService
      .addRestaurant(this.restaurantForm.value)
      .subscribe((restaurant) => console.log(restaurant));
  }
}
