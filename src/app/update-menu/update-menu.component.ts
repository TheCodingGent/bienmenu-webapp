import { Component, OnInit, Input } from '@angular/core';
import { FileUploadService } from '../file-upload.service';
import { Menu } from '../menu';

@Component({
  selector: 'app-update-menu',
  templateUrl: './update-menu.component.html',
  styleUrls: ['./update-menu.component.css'],
})
export class UpdateMenuComponent implements OnInit {
  @Input() restaurantId: string;
  @Input() menu: Menu;
  fileToUpload: File;

  constructor(private fileUploadService: FileUploadService) {}

  ngOnInit(): void {}

  handleInputFiles(files: FileList) {
    // Array.from(files).forEach((file) => {
    //   console.log(file.name);
    // });
    this.fileToUpload = files.item(0);
  }

  saveMenu() {
    console.log('Restaurant ID:' + this.restaurantId);
    console.log('submit');
    console.log(this.fileToUpload.name);

    this.fileUploadService
      .postFile(this.fileToUpload, this.restaurantId, this.menu.filename)
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
