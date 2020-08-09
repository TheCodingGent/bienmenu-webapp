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
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { FormatFilename } from 'src/app/helpers/utilities';

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

  menuFiles: Map<string, File>;
  menuFilesValid: Map<string, boolean>;

  isOperationFailed = false;
  isSuccess = false;

  constructor(
    private formBuilder: FormBuilder,
    private restaurantService: RestaurantService,
    private userService: UserService,
    private fileUploadService: FileUploadService,
    private tokenStorageService: TokenStorageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.menuFiles = new Map<string, File>();
    this.menuFilesValid = new Map<string, boolean>();

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
      Validators.pattern('^[#][a-zA-Z0-9]{6}$'),
    ]); // ensure color starts with # and has 6 characters

    this.restaurantForm = this.formBuilder.group({
      _id: [new ObjectID()],
      name: this.name,
      city: this.city,
      address: this.address,
      menus: this.formBuilder.array([this.createMenu()]),
      color: this.color,
    });

    this.menus = this.restaurantForm.get('menus') as FormArray;
  }

  createMenu(): FormGroup {
    return this.formBuilder.group({
      name: ['', [Validators.required, RxwebValidators.unique()]],
      filename: [''],
      lastupdated: [new Date().toISOString()],
    });
  }

  addMenu(): void {
    this.menus.push(this.createMenu());
  }

  deleteMenu(index: number): void {
    this.menus = this.restaurantForm.get('menus') as FormArray;
    this.menuFiles.delete(this.menus.at(index).get('name').value);
    this.menuFilesValid.delete(this.menus.at(index).get('name').value);
    this.menus.removeAt(index);
  }

  handleInputFiles(files: FileList, name: string) {
    let f = files.item(0);

    if (!f) {
      this.menuFilesValid.set(name, false);
      this.menuFiles.delete(name);
      return;
    }

    if (ValidateFile(f, 5242880, ['pdf'])) {
      this.menuFiles.set(name, f);
      this.menuFilesValid.set(name, true);
    } else {
      this.menuFilesValid.set(name, false);
    }
  }

  uploadFileToServer(fileToUpload: File, filename: string) {
    this.fileUploadService
      .postFile(
        fileToUpload,
        this.restaurantForm.get('_id').value,
        filename // set the file name to the one entered in the filename field
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
    //populate the menu file names
    for (let menu of this.menus.controls) {
      let name = menu.get('name').value;
      let file = this.menuFiles.get(name);

      menu.patchValue({
        filename: FormatFilename(name),
      });

      let filename = menu.get('filename').value;

      this.uploadFileToServer(file, filename);
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
            // setTimeout(() => this.router.navigate(['/user']), 3000);
            this.handleSuccessfulOperation();
          },
          (err) => {
            console.log(JSON.parse(err.error).message);
            this.isOperationFailed = true;
            this.isSuccess = false;
          }
        );
      });
  }

  handleSuccessfulOperation() {
    if (
      confirm(
        'You must logout and log back in to see your restaurant would you like to do that now?'
      )
    ) {
      this.tokenStorageService.signOut();
      window.location.reload();
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/user']);
    }
  }
}
