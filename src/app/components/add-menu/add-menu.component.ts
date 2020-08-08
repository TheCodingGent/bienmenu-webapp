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
import { MustNotBeDuplicateInRestaurant } from 'src/app/helpers/menu.filename.validator';
import { Restaurant } from 'src/app/models/restaurant';

@Component({
  selector: 'app-add-menu',
  templateUrl: './add-menu.component.html',
  styleUrls: ['./add-menu.component.css'],
})
export class AddMenuComponent implements OnInit {
  @Input() restaurant: Restaurant;
  @Output() closed = new EventEmitter<boolean>();
  @ViewChild('addmenumodal') addmenumodal;
  @ViewChild('menufile') menuFile: ElementRef;

  id = 'addmenumodal'; // modal id used by modal service

  isOperationFailed = false;
  isValidFile = false;
  isSubmitted = false;
  menuForm: FormGroup;
  name: FormControl;
  filename: FormControl;
  fileToUpload: File;

  constructor(
    private formBuilder: FormBuilder,
    private restaurantService: RestaurantService,
    private fileUploadService: FileUploadService,
    private userService: UserService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.modalService.add(this);

    this.name = this.formBuilder.control('', Validators.required);
    this.filename = this.formBuilder.control('', [
      Validators.required,
      Validators.pattern('^[a-z_0-9]+$'),
    ]);

    this.menuForm = this.formBuilder.group(
      {
        name: this.name,
        filename: this.filename,
        lastupdated: [new Date().toISOString()],
      },
      {
        validator: MustNotBeDuplicateInRestaurant(
          'filename',
          this.restaurant.menus
        ),
      }
    );
  }

  ngOnDestroy(): void {
    this.modalService.remove(this.id);
  }

  // open modal
  open(): void {
    this.addmenumodal.show();
  }

  // close modal
  close(): void {
    this.menuForm.reset();
    this.menuFile.nativeElement.value = '';
    this.addmenumodal.hide();
    this.closed.emit(true);
  }

  handleInputFiles(files: FileList) {
    this.isValidFile = ValidateFile(files.item(0), 5242880, ['pdf']);

    if (this.isValidFile) {
      this.fileToUpload = files.item(0);
    }
  }

  saveMenu() {
    this.isSubmitted = true;

    this.restaurantService
      .addMenu(this.menuForm.value, this.restaurant._id)
      .subscribe(
        (data) => {
          console.log(data);
          // if menu was added successfully to the db then upload the file
          this.fileUploadService
            .postFile(
              this.fileToUpload,
              this.restaurant._id,
              this.menuForm.get('filename').value
            )
            .subscribe(
              (data) => {
                // do something, if upload success
                this.userService.updateMenuUpdateCount().subscribe(
                  (_) => {
                    this.close();
                  },
                  (err) => {
                    console.log(JSON.parse(err.error).message);
                    this.isOperationFailed = true;
                  }
                );
              },
              (error) => {
                console.log(error);
                this.isOperationFailed = true;
              }
            );
        },
        (error) => {
          console.log('foo' + error);
          this.isOperationFailed = true;
        }
      );
  }
}
