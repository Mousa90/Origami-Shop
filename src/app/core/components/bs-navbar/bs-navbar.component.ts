import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { AppUser } from 'shared/models/app-user';
import { ShoppingCart } from 'shared/models/shopping-cart';
import { AuthService } from 'shared/services/auth.service';
import { ShoppingCartService } from 'shared/services/shopping-cart.service';

@Component({
  selector: 'bs-navbar',
  templateUrl: './bs-navbar.component.html',
  styleUrls: ['./bs-navbar.component.css']
})
export class BsNavbarComponent implements OnInit {
  appUser: AppUser | undefined;
  cart$: Observable<ShoppingCart> | undefined;
  errorMessage: string | null = null; // Property to hold error message
  isNavbarCollapsed = true;

  constructor(private http: HttpClient, private auth: AuthService, private shoppingCartService: ShoppingCartService) {}

  async ngOnInit() {
    this.auth.appUser$.subscribe(appUser => this.appUser = appUser);
    
    this.cart$ = await this.shoppingCartService.getCart();
  }

  logout() {
    this.auth.logout();
  }

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  causeServerError(): void {
    this.http.get('https://httpstat.us/500').pipe(
      catchError(err => {
        this.errorMessage = 'An error occurred while making the request. Please try again later.';
        console.error('HTTP Error:', err);
        // Return an observable with a fallback value
        return of(null);
      })
    ).subscribe({
      next: (response) => {
        if (response) {
          console.log('Response:', response);
          // Handle successful response
        }
      }
    });
  }

  causeRuntimeError() {
    alert('When the ErrorHandler catch an error It will prevent the website from breaking and silently log the error to the ' +
       'console without interrupting the user experience or causing any navigational disruptions. The website will ' +
       'continue running smoothly even if an error occurs, and users wont be aware of the error unless they inspect the console logs.');
    throw new Error('Test Runtime Error');
  }
}
