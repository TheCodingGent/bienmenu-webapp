import { Component, OnInit, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { RestaurantService } from '../restaurant.service';
import { FileUploadService } from '../file-upload.service';

@Component({
  selector: 'app-add-menu',
  templateUrl: './add-menu.component.html',
  styleUrls: ['./add-menu.component.css'],
})
export class AddMenuComponent implements OnInit {
  @Input() restaurantId: string;

  menuForm: FormGroup;
  name: FormControl;
  filename: FormControl;
  fileToUpload: File;

  constructor(
    private formBuilder: FormBuilder,
    private restaurantService: RestaurantService,
    private fileUploadService: FileUploadService
  ) {}

  ngOnInit() {
    this.name = this.formBuilder.control('', Validators.required);
    this.filename = this.formBuilder.control('', [
      Validators.required,
      Validators.pattern('^[a-z_]+$'),
    ]);

    this.menuForm = this.formBuilder.group({
      name: this.name,
      filename: this.filename,
    });
  }

  handleInputFiles(files: FileList) {
    // Array.from(files).forEach((file) => {
    //   console.log(file.name);
    // });
    this.fileToUpload = files.item(0);
  }

  saveMenu() {
    console.log('Restaurant ID:' + this.restaurantId);
    console.log('save');

    this.restaurantService
      .addMenu(this.menuForm.value, this.restaurantId)
      .subscribe(
        (data) => {
          console.log(data);
        },
        (error) => {
          console.log(error);
        }
      );

    this.fileUploadService
      .postFile(
        this.fileToUpload,
        this.restaurantId,
        this.menuForm.get('filename').value
      )
      .subscribe(
        (data) => {
          // do something, if upload success
          console.log(data);
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
