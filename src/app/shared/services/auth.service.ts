import 'firebase/compat/auth';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppUser } from 'shared/models/app-user';
import { UserService } from 'shared/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<firebase.User | null>;

  constructor(
    private userService: UserService,
    private afAuth: AngularFireAuth,
    private route: ActivatedRoute,
    private router: Router // Inject Router
  ) { 
    this.user$ = afAuth.authState;
  }

  login() {
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl', returnUrl);

    this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(() => {
        // On successful login, redirect to the saved returnUrl
        const savedReturnUrl = localStorage.getItem('returnUrl') || '/';
        localStorage.removeItem('returnUrl'); // Clear the returnUrl after use
        this.router.navigateByUrl(savedReturnUrl); // Redirect to the saved URL
      })
      .catch(error => {
        console.error('Login failed', error);
        // Handle login error here
      });
  }

  logout() {
    this.afAuth.signOut();
  }

  get appUser$(): Observable<AppUser> {
    return this.user$.pipe(
      switchMap(user => {
        if (user) {
          return this.userService.get(user.uid);
        } else {
          return of(null);
        }
      }))
  }
}
