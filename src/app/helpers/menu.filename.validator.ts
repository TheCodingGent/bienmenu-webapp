import { FormGroup, FormArray } from '@angular/forms';
import { Menu } from '../models/menu';

// custom validator to check that two fields match
export function MustNotBeDuplicateInForm(
  controlName: string,
  menus: FormArray
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

    for (let c of menus.controls) {
      if (c.get('filename').value === control.value) {
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

    for (let menu of menus) {
      if (menu.filename === control.value) {
        console.log('Found a duplicate');
        duplicate = true;
      }
    }
    console.log('No duplicate found');

    // set error on matchingControl if validation fails
    if (duplicate) {
      control.setErrors({ duplicate: true });
    } else {
      control.setErrors(null);
    }
  };
}
