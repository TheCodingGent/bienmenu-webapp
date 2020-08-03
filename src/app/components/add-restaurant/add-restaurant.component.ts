import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormArray,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { RestaurantService } from '../../services/restaurant.service';
import { FileUploadService } from '../../services/file-upload.service';
import { ObjectID } from 'bson';
import { ValidateFile } from 'src/app/helpers/file.validator';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-restaurant',
  templateUrl: './add-restaurant.component.html',
  styleUrls: ['./add-restaurant.component.css'],
})
export class AddRestaurantComponent implements OnInit {
  restaurantForm: FormGroup;
  menus: FormArray;
  name: FormControl;
  city: FormControl;
  address: FormControl;
  color: FormControl;

  menuFiles: Array<File>;
  isValidFile = true;
  menusMatchFiles = true;
  isOperationFailed = false;
  isSuccess = false;

  constructor(
    private formBuilder: FormBuilder,
    private restaurantService: RestaurantService,
    private userService: UserService,
    private fileUploadService: FileUploadService,
    private router: Router
  ) {}

  ngOnInit() {
    this.menuFiles = new Array();
    this.name = this.formBuilder.control('', Validators.required);
    this.city = this.formBuilder.control('', [
      Validators.required,
      Validators.pattern('^([A-Z][a-z]*((\\s[A-Za-z])?[a-z]*)*)$'), // check if only first letter is capital
    ]);
    this.address = this.formBuilder.control('', [
      Validators.required,
      Validators.pattern(
        '^[0-9]{1,5}[,\\s].*[,\\s](([A-Z][0-9][A-Z]\\s{0,1}[0-9][A-Z][0-9])|([0-9]{5}))$' // ensure address starts with numbers and ends with a zipcode
      ),
    ]);
    this.color = this.formBuilder.control('', [
      Validators.pattern('^[#][a-z0-9]{6}$'),
    ]); // ensure color starts with # and has 6 characters

    this.restaurantForm = this.formBuilder.group({
      _id: [new ObjectID()],
      name: this.name,
      city: this.city,
      address: this.address,
      menus: this.formBuilder.array([this.createMenu()]),
      color: this.color,
    });
  }

  createMenu(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      filename: ['', [Validators.required, Validators.pattern('^[a-z_0-9]+$')]], // must be all small letters and only contain letters and underscores
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

  handleInputFiles(files: FileList) {
    Array.from(files).forEach((file) => {
      const duplicate = this.menuFiles.find((f) => f.name === file.name);
      if (ValidateFile(file, 5242880, ['pdf']) || !duplicate) {
        this.menuFiles.push(file);
      } else {
        this.isValidFile = false;
      }
    });
  }

  deleteFile(name) {
    let f = this.menuFiles.find((f) => f.name === name);
    let index = this.menuFiles.indexOf(f, 0);
    if (index > -1) {
      this.menuFiles.splice(index, 1);
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

    let m = this.restaurantForm.get('menus')['controls'];

    if (!m || !this.menuFiles || m.length != this.menuFiles.length) {
      this.menusMatchFiles = false;
      return;
    }

    //upload the files
    for (let [i, file] of this.menuFiles.entries()) {
      console.log(file.name);
      this.uploadFileToServer(file, i);
    }

    this.restaurantService
      .addRestaurantForUser(this.restaurantForm.value)
      .subscribe((restaurant) => {
        console.log(restaurant);
        this.userService.updateRestaurantCount().subscribe(
          (_) => {
            console.log('Restaurant updated successfully');
            this.isSuccess = true;
            this.isOperationFailed = false;
            setTimeout(() => this.router.navigate(['/user']), 3000);
          },
          (err) => {
            console.log(JSON.parse(err.error).message);
            this.isOperationFailed = true;
            this.isSuccess = false;
          }
        );
      });
  }
}
