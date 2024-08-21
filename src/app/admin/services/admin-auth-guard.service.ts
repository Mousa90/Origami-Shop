import { UserService } from 'shared/services/user.service';
import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from 'shared/services/auth.service';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuardService implements CanActivate {

  constructor(
    private auth: AuthService,
    private userService: UserService
  ) {}

  canActivate(): Observable<boolean> {
    return this.auth.user$.pipe(
      switchMap(user => {
        if (user) {
          return this.userService.get(user.uid);
        } else {
          return of(null);
        }
      }),
      map(appUser => appUser ? appUser.isAdmin : false)
    )
  }
}


