import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { of } from 'rxjs/internal/observable/of';
import { catchError, map } from 'rxjs/operators';

import { UserService } from '../services/user.service';

@Injectable({ providedIn: 'root' })
export class PartnerGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.userService.getPartnerContent().pipe(
      map((_) => true),
      catchError((_) => {
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/feature-not-allowed'], {
          queryParams: { returnUrl: state.url },
        });
        return of(false);
      })
    );
  }
}
