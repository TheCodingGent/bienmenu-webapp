import { Menu } from '../models/menu';
import { FormGroup } from '@angular/forms';

export function ValidateFile(
  file: File,
  size: number,
  allowedExtensions: string[]
) {
  return (
    file.size < size &&
    allowedExtensions.includes(file.name.split('.').pop().toLowerCase())
  );
}

export function MustNotBeDuplicateInRestaurant(
  controlName: string,
  menus: Menu[]
) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    let duplicate = false;

    if (control.errors && !control.errors.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    if (!menus) {
      //menus empty
      return;
    }

    // check if name already exists
    for (let menu of menus) {
      if (menu.name === control.value) {
        duplicate = true;
      }
    }

    // set error on matchingControl if validation fails
    if (duplicate) {
      control.setErrors({ duplicate: true });
    } else {
      control.setErrors(null);
    }
  };
}
