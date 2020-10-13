import { Menu } from '../models/menu';
import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

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

export function MustNotBeDuplicateInRestaurant(menus: Menu[]): ValidatorFn {
  return (group: FormGroup): ValidationErrors => {
    const control = group.controls['name'];
    let duplicate = false;

    if (!menus || !control.value) {
      return;
    }

    // check if name already exists
    for (let menu of menus) {
      if (menu.name.toLowerCase() === control.value.toLowerCase()) {
        duplicate = true;
      }
    }

    // set error on matchingControl if validation fails
    if (duplicate) {
      control.setErrors({ duplicate: true });
    } else {
      control.setErrors(null);
    }

    return;
  };
}
