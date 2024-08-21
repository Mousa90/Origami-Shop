import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from 'shared/services/auth.service';
import { ScrollToTopService } from 'shared/services/scroll-to-top.service';
import { UserService } from 'shared/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentRoute: string = '';
  isLoading = true;
  isAuthDetermined = false; // Flag to track authentication determination
  requiresAuth = false; // Flag to check if the current route requires authentication
  
  constructor(
    private userService: UserService, 
    private auth: AuthService, 
    private router: Router, 
    private scrollToTopService: ScrollToTopService,
    private titleService: Title) {
      this.titleService.setTitle('Origami Shop');
    }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(event => {
      this.currentRoute = this.router.url;
      this.requiresAuth = this.isAuthRequired(this.currentRoute);

      if (this.requiresAuth) {
        this.auth.user$.subscribe(user => {
          this.isAuthDetermined = true; // Authentication state is determined
          this.isLoading = false;

          if (!user) return;

          this.userService.save(user);

          let returnUrl = localStorage.getItem('returnUrl');
          if (!returnUrl) return;

          localStorage.removeItem('returnUrl'); // Clear the returnUrl after use
          this.router.navigateByUrl(returnUrl);
        });
      } else {
        this.isLoading = false;
        this.isAuthDetermined = true;
      }

      this.scrollToTopService.scrollToTop();
    });
  }

  isAuthRequired(url: string): boolean {
    // Define the routes that need authentication
    const authRequiredRoutes: any[] = []; // Example routes
    return authRequiredRoutes.some(route => url.startsWith(route));
  }
}
