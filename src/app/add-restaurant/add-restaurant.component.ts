import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { RestaurantService } from '../restaurant.service';
import { FileUploadService } from '../file-upload.service';
import { ObjectID } from 'bson';

@Component({
  selector: 'app-add-restaurant',
  templateUrl: './add-restaurant.component.html',
  styleUrls: ['./add-restaurant.component.css'],
})
export class AddRestaurantComponent implements OnInit {
  restaurantForm: FormGroup;
  menus: FormArray;
  menuFiles: Array<File>;
  currentId: ObjectID;

  constructor(
    private formBuilder: FormBuilder,
    private restaurantService: RestaurantService,
    private fileUploadService: FileUploadService
  ) {}

  ngOnInit() {
    this.currentId = new ObjectID();
    this.menuFiles = new Array();
    this.restaurantForm = this.formBuilder.group({
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
    this.menuFiles.push(files.item(0));
  }

  uploadFileToServer(fileToUpload: File, index: number) {
    let menus = this.restaurantForm.get('menus') as FormArray;
    this.fileUploadService
      .postFile(
        fileToUpload,
        this.currentId.toString(),
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

    // upload the files
    for (let [i, file] of this.menuFiles.entries()) {
      console.log(file.name);
      this.uploadFileToServer(file, i);
    }

    this.restaurantService
      .addRestaurant(this.restaurantForm.value, this.currentId.toString())
      .subscribe((restaurant) => console.log(restaurant));
  }
}
