import { Injectable, ErrorHandler, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private router: Router, private ngZone: NgZone) { }

  handleError(error: any): void {
    // Log all errors to the console
    console.error('An error occurred:', error);
  }
}
