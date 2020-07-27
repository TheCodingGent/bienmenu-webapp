import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { FileUploadService } from '../../services/file-upload.service';
import { Menu } from '../../models/menu';
import { ModalService } from 'src/app/services/modal.service';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { ValidateFile } from 'src/app/helpers/file.validator';

@Component({
  selector: 'app-update-menu',
  templateUrl: './update-menu.component.html',
  styleUrls: ['../../app.component.css', './update-menu.component.css'],
})
export class UpdateMenuComponent implements OnInit {
  @Input() restaurantId: string;
  @Input() menu: Menu;
  @Output() success = new EventEmitter<boolean>();
  @ViewChild('updatemenumodal') updatemenumodal;

  id = 'updatemenumodal'; // modal id used by modal service

  fileToUpload: File;
  isOperationFailed = false;
  isInvalidFile = false;

  constructor(
    private fileUploadService: FileUploadService,
    private modalService: ModalService,
    private restaurantService: RestaurantService
  ) {}

  ngOnInit(): void {
    this.modalService.add(this);
  }

  ngOnDestroy(): void {
    this.modalService.remove(this.id);
  }

  // open modal
  open(): void {
    this.updatemenumodal.show();
  }

  // close modal
  close(): void {
    this.updatemenumodal.hide();
  }

  handleInputFiles(files: FileList) {
    this.isInvalidFile = ValidateFile(files.item(0), 5242880, ['pdf']);

    if (!this.isInvalidFile) {
      this.fileToUpload = files.item(0);
    }
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

          //update menu timestamp
          this.restaurantService
            .updateMenu(this.menu, this.restaurantId)
            .subscribe(
              (data) => {
                console.log(data);

                this.success.emit(true);
                this.close();
              },
              (error) => {
                console.log(error);
                this.isOperationFailed = true;
              }
            );
        },
        (error) => {
          console.log(error);
          this.isOperationFailed = true;
        }
      );
  }
}
