import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter,
  ElementRef,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { RestaurantService } from '../../services/restaurant.service';
import { FileUploadService } from '../../services/file-upload.service';
import { ModalService } from 'src/app/services/modal.service';
import { ValidateFile } from 'src/app/helpers/file.validator';
import { UserService } from 'src/app/services/user.service';
import { MustNotBeDuplicateInRestaurant } from 'src/app/helpers/file.validator';
import { Restaurant } from 'src/app/models/restaurant';
import { FormatFilename } from 'src/app/helpers/utilities';
import { Menu, MenuType } from 'src/app/models/menu';
import { MenuService } from 'src/app/services/menu.service';
import { ObjectId } from 'bson';

@Component({
  selector: 'app-add-menu',
  templateUrl: './add-menu.component.html',
  styleUrls: ['./add-menu.component.scss'],
})
export class AddMenuComponent implements OnInit {
  @Input() restaurant: Restaurant;
  @Output() closed = new EventEmitter<boolean>();
  @ViewChild('addMenuModal') addMenuModal;

  id = 'addMenuModal'; // modal id used by modal service

  menu: Menu;
  menuToUpdate: Menu;
  isUpdating: boolean = false;
  isExternalMenu: boolean = false;

  menus: Menu[];

  isOperationFailed = false;
  isValidFile = false;
  isSubmitted = false;
  menuForm: FormGroup;
  name: FormControl;
  externalMenuLink: FormControl;
  fileToUpload: File;

  constructor(
    private formBuilder: FormBuilder,
    private restaurantService: RestaurantService,
    private fileUploadService: FileUploadService,
    private userService: UserService,
    private modalService: ModalService,
    private menuService: MenuService
  ) {}

  ngOnInit() {
    this.modalService.add(this);
    this.menus = this.restaurant.menuBank.menus;

    this.name = this.formBuilder.control('', Validators.required);

    this.menuForm = this.formBuilder.group({
      name: this.name,
      filename: [''],
    });
  }

  ngOnDestroy(): void {
    this.modalService.remove(this.id);
  }

  // open modal
  open(): void {
    this.addMenuModal.show();
    if (this.isUpdating) {
      // set the name control value
      this.menuForm.patchValue({
        name: this.menuToUpdate.name,
      });
    }

    if (this.isExternalMenu) {
      this.externalMenuLink = this.formBuilder.control('', Validators.required);
      this.menuForm.addControl('externalMenuLink', this.externalMenuLink);

      if (this.isUpdating) {
        this.menuForm.patchValue({
          externalMenuLink: this.menuToUpdate.externalMenuLink,
        });
      }
    } else {
      this.menuForm.removeControl('externalMenuLink');
    }
  }

  // close modal
  close(): void {
    this.menuForm.reset();
    this.addMenuModal.hide();

    // clear foodItem in addFoodItem modal
    this.menuToUpdate = undefined;
    this.isUpdating = false;

    this.closed.emit(true);
  }

  handleInputFiles(files: FileList) {
    this.isValidFile = ValidateFile(files.item(0), 5242880, ['pdf']);

    if (this.isValidFile) {
      this.fileToUpload = files.item(0);
    }
  }

  createMenuObject(): void {
    this.menu = this.menuForm.value; // sets the name and the filename
    if (this.isUpdating) {
      this.menu._id = this.menuToUpdate._id;
    } else {
      this.menu._id = new ObjectId().toHexString();
    }
    this.menu.isActive = true;
    this.menu.type = this.isExternalMenu
      ? MenuType.ExternalLinkMenu
      : MenuType.FileBasedMenu;
    this.menu.lastupdated = new Date().toISOString();
  }

  saveMenu() {
    this.isSubmitted = true;

    // set the filename based on the name
    this.menuForm.patchValue({
      filename: FormatFilename(this.name.value),
    });

    this.createMenuObject();

    this.menuService
      .addMenuForRestaurant(this.restaurant._id, this.menu)
      .subscribe(
        (_) => {
          this.userService.updateMenuUpdateCount().subscribe(
            (_) => {
              // if file based menu and menu added successfully upload menu file
              if (!this.isExternalMenu) {
                this.fileUploadService
                  .postFile(
                    this.fileToUpload,
                    this.restaurant._id,
                    this.menuForm.get('filename').value
                  )
                  .subscribe(
                    (_) => {
                      this.close();
                      window.location.reload();
                      this.isSubmitted = false;
                    },
                    (error) => {
                      console.log(error);
                      this.isSubmitted = false;
                      this.isOperationFailed = true;
                    }
                  );
              } else {
                this.close();
                window.location.reload();
                this.isSubmitted = false;
              }
            },
            (err) => {
              console.log(JSON.parse(err.error).message);
              this.isSubmitted = false;
              this.isOperationFailed = true;
            }
          );
        },
        (error) => {
          console.log(error);
          this.isSubmitted = false;
          this.isOperationFailed = true;
        }
      );

    // this.restaurantService
    //   .addMenu(this.menuForm.value, this.restaurant._id)
    //   .subscribe(
    //     (data) => {
    //       // if menu was added successfully to the db then upload the file
    //       this.fileUploadService
    //         .postFile(
    //           this.fileToUpload,
    //           this.restaurant._id,
    //           this.menuForm.get('filename').value
    //         )
    //         .subscribe(
    //           (data) => {
    //             // do something, if upload success
    //             this.userService.updateMenuUpdateCount().subscribe(
    //               (_) => {
    //                 this.close();
    //                 window.location.reload();
    //               },
    //               (err) => {
    //                 console.log(JSON.parse(err.error).message);
    //                 this.isOperationFailed = true;
    //               }
    //             );
    //           },
    //           (error) => {
    //             this.isOperationFailed = true;
    //           }
    //         );
    //     },
    //     (error) => {
    //       this.isOperationFailed = true;
    //     }
    //   );
  }
}
