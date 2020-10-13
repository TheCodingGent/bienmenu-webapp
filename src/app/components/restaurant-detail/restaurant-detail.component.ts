import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Restaurant } from 'src/app/models/restaurant';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { ModalService } from 'src/app/services/modal.service';
import { Menu, MenuType } from 'src/app/models/menu';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserService } from 'src/app/services/user.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { LightOrDark } from 'src/app/helpers/color.helper';
import { ValidateFile } from 'src/app/helpers/file.validator';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { FormatFilename } from 'src/app/helpers/utilities';
import { AppConfigService } from 'src/app/services/app-config.service';
import { MenuService } from 'src/app/services/menu.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ThemePalette } from '@angular/material/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-restaurant-detail',
  templateUrl: './restaurant-detail.component.html',
  styleUrls: ['./restaurant-detail.component.scss'],
  animations: [
    trigger('EnterLeave', [
      state('flyIn', style({ transform: 'translateX(0)' })),
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('0.5s 300ms ease-in'),
      ]),
      transition(':leave', [
        animate('0.3s ease-out', style({ transform: 'translateX(100%)' })),
      ]),
    ]),
  ],
})
export class RestaurantDetailComponent implements OnInit {
  @ViewChild('coverPhotoImage')
  coverPhotoImageInput: ElementRef;
  @ViewChild('addMenuComponent')
  addMenuComponent;
  color: ThemePalette = 'primary';

  restaurant: Restaurant;
  menus: Menu[];
  success = false;

  menuToUpdateIndex = -1;
  menuToUpdate: Menu;

  userAllowedOnPage = false;
  menuUpdateAllowed = false;
  maxMenuCountReached = true;
  userHasContactTracing = false;
  hostedInternal = true;

  currentUser: any;
  currentPlan: string;

  selectedCTSetting = false;
  isCTSettingSubmitted = false;

  isValidImage = false;
  coverPhotoToUpload: File;

  isHostingSettingSubmitted = false;
  isOperationFailed = false;
  isSubmitted = false;

  mainColor = '#009688';

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private userService: UserService,
    private modalService: ModalService,
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private elRef: ElementRef,
    private token: TokenStorageService,
    private fileUploadService: FileUploadService,
    private appConfigService: AppConfigService,
    private menuService: MenuService
  ) {}

  setColorThemeProperty() {
    this.elRef.nativeElement.style.setProperty('--main-color', this.mainColor);
    this.elRef.nativeElement.style.setProperty(
      '--accent-color',
      this.mainColor + '4d'
    );

    if (LightOrDark(this.mainColor) == 'light') {
      this.elRef.nativeElement.style.setProperty('--font-color', '#000000');
    } else {
      this.elRef.nativeElement.style.setProperty('--font-color', '#ffffff');
    }
  }

  ngOnInit(): void {
    if (
      this.tokenStorageService
        .getUser()
        .restaurants.find(
          (restaurant) =>
            restaurant._id === this.route.snapshot.paramMap.get('id')
        ) ||
      this.tokenStorageService.getUser().roles.includes('ROLE_ADMIN')
    ) {
      this.menuToUpdate = undefined; // reset menu to update on init
      this.currentUser = this.token.getUser();
      this.currentPlan = this.currentUser.plan;

      this.userAllowedOnPage = true;
      this.getMenuUpdateAllowed();
      this.getUserHasContactTracing();
      this.getRestaurant();
    }
  }

  openModal(id: string, index: number) {
    this.menuToUpdateIndex = index;
    this.modalService.open(id);
  }

  onClosedModal(_) {
    this.ngOnInit();
  }

  updateSuccess(_) {
    this.success = true;
    setTimeout(() => (this.success = false), 3000);
    this.ngOnInit();
  }

  formatDate(utcDate: string) {
    return new Date(utcDate).toLocaleString();
  }

  getRestaurant(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.restaurantService.getRestaurant(id).subscribe((restaurant) => {
      this.restaurant = restaurant;
      this.getMenuMaxCountReached();
      this.selectedCTSetting = restaurant.tracingEnabled;
      this.menus = restaurant.menuBank.menus;
      //this.mainColor = restaurant.color;
      //this.setColorThemeProperty();
    });
  }

  getMenuUpdateAllowed(): void {
    this.userService.getMenuUpdateAllowed().subscribe(
      (_) => {
        this.menuUpdateAllowed = true;
      },
      (err) => {
        console.log(err.message);
        this.menuUpdateAllowed = false;
      }
    );
  }

  getUserHasContactTracing(): void {
    this.userService.getUserHasContactTracing().subscribe(
      (_) => {
        this.userHasContactTracing = true;
      },
      (err) => {
        console.log(err.message);
        this.userHasContactTracing = false;
      }
    );
  }

  getMenuMaxCountReached(): void {
    this.restaurantService
      .getMenuMaxCountReached(this.restaurant._id)
      .subscribe(
        (_) => {
          this.maxMenuCountReached = false;
        },
        (err) => {
          console.log(err.message);
          this.maxMenuCountReached = true;
        }
      );
  }

  deleteMenu(menu: Menu, restaurantId: string) {
    // if (
    //   confirm('Are you sure you want to delete this menu and all its data?')
    // ) {
    //   this.menuService.deleteMenuById(restaurantId, menu).subscribe((_) => {
    //     window.location.reload();
    //   }),
    //     (err) => {
    //       console.log('An error occurred: ' + err);
    //     };
    // }

    Swal.fire({
      title: 'Are you sure you want to delete this menu and all its data?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#009688',
      cancelButtonColor: '#FF0000',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.menuService.deleteMenuById(restaurantId, menu).subscribe((_) => {
          window.location.reload();
        }),
          (err) => {
            console.log('An error occurred: ' + err);
          };
      }
    });
  }

  deleteRestaurant(restaurantId: string) {
    // if (
    //   confirm(
    //     'Are you sure you want to delete this restaurant? This action cannot be undone.'
    //   )
    // ) {
    //   this.restaurantService.deleteRestaurant(restaurantId).subscribe((_) => {
    //     this.tokenStorageService.deleteRestaurant(restaurantId);
    //     this.router.navigate(['/user']).then(() => {
    //       window.location.reload();
    //     });
    //   }),
    //     (err) => {
    //       console.log('An error occurred: ' + err);
    //     };
    // }

    Swal.fire({
      title:
        'Are you sure you want to delete this restaurant? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#009688',
      cancelButtonColor: '#FF0000',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.restaurantService.deleteRestaurant(restaurantId).subscribe((_) => {
          this.tokenStorageService.deleteRestaurant(restaurantId);
          this.router.navigate(['/user']).then(() => {
            window.location.reload();
          });
        }),
          (err) => {
            console.log('An error occurred: ' + err);
          };
      }
    });
  }

  saveContactTracing() {
    // if (
    //   confirm('Are you sure you want to modify the contact tracing setting?')
    // ) {
    //   this.isCTSettingSubmitted = true;
    //   this.restaurantService
    //     .updateContactTracing(this.selectedCTSetting, this.restaurant._id)
    //     .subscribe((data) => {
    //       this.isCTSettingSubmitted = false;
    //       window.location.reload();
    //     }),
    //     (err) => {
    //       console.log('An error occurred: ' + err);
    //       this.isCTSettingSubmitted = false;
    //     };
    // }

    Swal.fire({
      title: 'Are you sure you want to modify the contact tracing setting?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#009688',
      cancelButtonColor: '#FF0000',
      confirmButtonText: 'Yes, modify it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isCTSettingSubmitted = true;
        this.restaurantService
          .updateContactTracing(this.selectedCTSetting, this.restaurant._id)
          .subscribe((data) => {
            this.isCTSettingSubmitted = false;
            window.location.reload();
          }),
          (err) => {
            console.log('An error occurred: ' + err);
            this.isCTSettingSubmitted = false;
          };
      }
    });
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

  uploadCoverPhoto() {
    this.isSubmitted = true;
    const coverPhotoUrl = `${this.appConfigService.mainS3BucketUrl}businesses/${
      this.restaurant._id
    }/${FormatFilename(
      this.restaurant.name
    )}.${this.coverPhotoToUpload.name.split('.').pop()}`;

    this.restaurantService
      .updateCoverPhotoUrl(coverPhotoUrl, this.restaurant._id)
      .subscribe(
        (data) => {
          this.fileUploadService
            .uploadImage(
              'businesses',
              this.restaurant._id,
              this.coverPhotoToUpload,
              FormatFilename(this.restaurant.name)
            )
            .subscribe((data) => {
              this.isSubmitted = false;
              this.coverPhotoImageInput.nativeElement.value = '';
              window.location.reload();
            });
        },
        (error) => {
          this.isSubmitted = false;
          this.isOperationFailed = true;
        }
      );
  }

  openAddMenu(menuType: MenuType) {
    switch (menuType) {
      case MenuType.FileBasedMenu: {
        this.addMenuComponent.isExternalMenu = false;
        this.openModal('addMenuModal', -1);
        break;
      }

      case MenuType.ExternalLinkMenu: {
        this.addMenuComponent.isExternalMenu = true;
        this.openModal('addMenuModal', -1);
        break;
      }
    }
  }

  updateMenu(menuId: string, menuIndex: number) {
    switch (+this.menus[menuIndex].type) {
      case MenuType.FileBasedMenu: {
        this.addMenuComponent.menuToUpdate = this.menus[menuIndex];
        this.addMenuComponent.isUpdating = true;
        this.addMenuComponent.isExternalMenu = false;
        this.openModal('addMenuModal', menuIndex);
        break;
      }

      case MenuType.BienMenuMenu: {
        this.goToRoute('/create-menu/' + this.restaurant._id + '/' + menuId);
        break;
      }

      case MenuType.ExternalLinkMenu: {
        this.addMenuComponent.menuToUpdate = this.menus[menuIndex];
        this.addMenuComponent.isUpdating = true;
        this.addMenuComponent.isExternalMenu = true;
        this.openModal('addMenuModal', menuIndex);
        break;
      }
    }
  }

  enumToMenuType(type: MenuType): string {
    switch (+type) {
      case MenuType.FileBasedMenu: {
        let menuType = MenuType[MenuType.FileBasedMenu];
        let i = menuType.lastIndexOf('Menu');

        return menuType.slice(0, i) + ' ' + menuType.slice(i);
      }
      case MenuType.BienMenuMenu: {
        let menuType = MenuType[MenuType.BienMenuMenu];
        let i = menuType.lastIndexOf('Menu');

        return menuType.slice(0, i) + ' ' + menuType.slice(i);
      }
      case MenuType.ExternalLinkMenu: {
        let menuType = MenuType[MenuType.ExternalLinkMenu];
        let i = menuType.lastIndexOf('Menu');

        return menuType.slice(0, i) + ' ' + menuType.slice(i);
      }
    }
  }

  onChangeCT(value: string) {
    this.selectedCTSetting = value === 'true';
  }

  onMenuToggle(event: MatSlideToggleChange, menuIndex: number) {
    let menu = this.menus[menuIndex];

    this.menuService
      .updateMenuStatus(menu._id, event.checked)
      .subscribe((_) => {
        menu.isActive = event.checked;
      });
  }

  goToRoute(url: string): void {
    this.router.navigateByUrl(url);
  }
}
