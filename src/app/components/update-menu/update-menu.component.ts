import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FileUploadService } from '../../services/file-upload.service';
import { Menu } from '../../models/menu';
import { ModalService } from 'src/app/services/modal.service';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { ValidateFile } from 'src/app/helpers/file.validator';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-update-menu',
  templateUrl: './update-menu.component.html',
  styleUrls: ['./update-menu.component.scss'],
})
export class UpdateMenuComponent implements OnInit {
  @Input() restaurantId: string;
  @Input() menu: Menu;
  @Output() success = new EventEmitter<boolean>();
  @ViewChild('updateMenuModal') updatemenumodal;
  @ViewChild('menufile') menuFile: ElementRef;

  id = 'updateMenuModal'; // modal id used by modal service

  fileToUpload: File;
  isOperationFailed = false;
  isValidFile = false;
  isSubmitted = false;

  constructor(
    private fileUploadService: FileUploadService,
    private modalService: ModalService,
    private restaurantService: RestaurantService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.id += this.menu._id;
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
    this.menuFile.nativeElement.value = '';
    this.updatemenumodal.hide();
  }

  handleInputFiles(files: FileList) {
    this.isValidFile = ValidateFile(files.item(0), 5242880, ['pdf']);

    if (this.isValidFile) {
      this.fileToUpload = files.item(0);
    }
  }

  saveMenu() {
    console.log('Restaurant ID:' + this.restaurantId);
    this.isSubmitted = true;

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
                // update the number of times the use has updated or added a menu other initial creation
                this.userService.updateMenuUpdateCount().subscribe(
                  (_) => {
                    this.success.emit(true);
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
          console.log(error);
          this.isOperationFailed = true;
        }
      );
  }
}
