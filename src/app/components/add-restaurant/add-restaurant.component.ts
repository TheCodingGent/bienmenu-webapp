import {
  Component,
  OnInit,
  NgZone,
  ChangeDetectorRef,
  AfterViewChecked,
} from '@angular/core';
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
import { RxwebValidators, disable } from '@rxweb/reactive-form-validators';
import { FormatFilename } from 'src/app/helpers/utilities';
import { Restaurant } from 'src/app/models/restaurant';
import {
  getPhone,
  getCity,
  getFormattedAddress,
  getCountry,
  getState,
  getPostCode,
} from 'src/app/helpers/google.address.formatter';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { AppConfigService } from 'src/app/services/app-config.service';

@Component({
  selector: 'app-add-restaurant',
  templateUrl: './add-restaurant.component.html',
  styleUrls: ['./add-restaurant.component.scss'],
})
export class AddRestaurantComponent implements OnInit, AfterViewChecked {
  restaurantForm: FormGroup;
  restaurant: Restaurant;
  menus: FormArray;
  name: FormControl;
  color: FormControl;
  externalMenuLink: FormControl;

  currentUser: any;
  currentPlan: string;

  country: string;
  province: string;
  city: string;
  postalCode: string;
  address: string;
  phone: string;
  selectedMenuOption: string = 'internal';

  menuFiles: Map<string, File>;
  menuFilesValid: Map<string, boolean>;

  isValidImage = false;
  coverPhotoToUpload: File;

  isAddressSet = false;
  isOperationFailed = false;
  isSuccess = false;
  isSubmitted = false;
  maxMenuCountReached = false;
  maxMenuCount = 4;

  selectedColor: string = '#009688';

  constructor(
    private formBuilder: FormBuilder,
    private restaurantService: RestaurantService,
    private userService: UserService,
    private fileUploadService: FileUploadService,
    private router: Router,
    private ngZone: NgZone,
    private tokenStorageService: TokenStorageService,
    private changeDetector: ChangeDetectorRef,
    private token: TokenStorageService,
    private appConfigService: AppConfigService
  ) {}

  ngOnInit() {
    this.currentUser = this.token.getUser();
    this.currentPlan = this.currentUser.plan;

    this.menuFiles = new Map<string, File>();
    this.menuFilesValid = new Map<string, boolean>();

    this.name = this.formBuilder.control('', Validators.required);
    this.externalMenuLink = this.formBuilder.control('');
    this.color = this.formBuilder.control({ value: '', disabled: true }, [
      Validators.pattern('^[#][a-zA-Z0-9]{6}$'),
    ]); // ensure color starts with # and has 6 characters

    this.restaurantForm = this.formBuilder.group({
      _id: [new ObjectID()],
      name: this.name,
      externalMenuLink: this.externalMenuLink,
      menus: this.formBuilder.array([]),
      color: this.color,
    });

    this.menus = this.restaurantForm.get('menus') as FormArray;

    // get max menus allowed
    this.getMenuMaxCount();
  }

  // to prevent error of changed after checked error
  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
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

    if (this.menus.length >= this.maxMenuCount) {
      this.maxMenuCountReached = true;
    }
  }

  deleteMenu(index: number): void {
    this.menus = this.restaurantForm.get('menus') as FormArray;
    this.menuFiles.delete(this.menus.at(index).get('name').value);
    this.menuFilesValid.delete(this.menus.at(index).get('name').value);
    this.menus.removeAt(index);
    this.maxMenuCountReached = this.menus.length >= this.maxMenuCount;
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

  handleImageFile(files: FileList) {
    this.isValidImage = ValidateFile(files.item(0), 5242880, [
      'png',
      'jpeg',
      'jpg',
    ]);

    if (this.isValidImage) {
      this.coverPhotoToUpload = files.item(0);
    }
  }

  async uploadFileToServer(fileToUpload: File, filename: string) {
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

  getMenuMaxCount(): void {
    this.userService.getMaxMenuCountAllowed().subscribe(
      (data) => {
        this.maxMenuCount = data.maxMenusPerRestaurant;
      },
      (err) => {
        console.log(err.message);
        this.maxMenuCount = 4; // set it to default
      }
    );
  }

  getAddress(place: object) {
    if (place) {
      this.isAddressSet = true;
      this.country = getCountry(place);
      this.province = getState(place);
      this.city = getCity(place);
      this.postalCode = getPostCode(place);
      this.address = getFormattedAddress(place);
      this.phone = getPhone(place);

      //this.ngZone.run(() => {});
    }
  }

  buildRestaurant() {
    this.restaurant = this.restaurantForm.value;

    this.restaurant.country = this.country;
    this.restaurant.province = this.province;
    this.restaurant.city = this.city;
    this.restaurant.postalCode = this.postalCode;
    this.restaurant.address = this.address;
    this.restaurant.phone = this.phone;
    this.restaurant.color = this.selectedColor;
    //this.restaurant.hostedInternal = this.selectedMenuOption === 'internal';
    if (this.currentPlan === 'contact-tracing') {
      this.restaurant.tracingEnabled = true;
    }
    if (this.coverPhotoToUpload) {
      this.restaurant.coverPhotoUrl = `${
        this.appConfigService.mainS3BucketUrl
      }businesses/${this.restaurant._id}/${FormatFilename(
        this.restaurant.name
      )}.${this.coverPhotoToUpload.name.split('.').pop()}`;
    }
  }

  onMenuOptionChange(menuOption) {
    if (menuOption === 'external') {
      this.menus = this.restaurantForm.get('menus') as FormArray;
      this.menuFiles.clear();
      this.menuFilesValid.clear();
      this.menus.clear();

      this.restaurantForm
        .get('externalMenuLink')
        .setValidators(Validators.required);
      this.restaurantForm.get('externalMenuLink').updateValueAndValidity();
    } else {
      this.restaurantForm.get('externalMenuLink').reset();
      this.restaurantForm.get('externalMenuLink').clearValidators();
      this.restaurantForm.get('externalMenuLink').updateValueAndValidity();
    }
  }

  async onSubmit() {
    this.isSubmitted = true;
    this.restaurantForm.disable();

    //populate the menu file names
    for (let menu of this.menus.controls) {
      let name = menu.get('name').value;
      let file = this.menuFiles.get(name);

      menu.patchValue({
        filename: FormatFilename(name),
      });

      let filename = menu.get('filename').value;

      await this.uploadFileToServer(file, filename);
    }

    // build restaurant object to be sent to the server
    this.buildRestaurant();

    this.restaurantService
      .addRestaurantForUser(this.restaurant)
      .subscribe((restaurant) => {
        this.userService.updateRestaurantCount().subscribe(
          (_) => {
            if (this.coverPhotoToUpload) {
              this.fileUploadService
                .uploadImage(
                  'businesses',
                  this.restaurant._id,
                  this.coverPhotoToUpload,
                  FormatFilename(this.restaurant.name)
                )
                .subscribe((_) => {
                  this.isSubmitted = false;
                  this.isSuccess = true;
                  this.isOperationFailed = false;
                  this.tokenStorageService.saveRestaurant(this.restaurant);
                  this.router.navigate(['/user']).then(() => {
                    window.location.reload();
                  });
                });
            } else {
              this.isSubmitted = false;
              this.isSuccess = true;
              this.isOperationFailed = false;
              this.tokenStorageService.saveRestaurant(this.restaurant);
              this.router.navigate(['/user']).then(() => {
                window.location.reload();
              });
            }
          },
          (err) => {
            console.log(JSON.parse(err.error).message);
            this.isSubmitted = false;
            this.isOperationFailed = true;
            this.isSuccess = false;
            this.restaurantForm.enable();
          }
        );
      });
  }
}
