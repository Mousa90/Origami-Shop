import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollToTopService {

  constructor() { }

  scrollToTop(): void {
    window.scrollTo(0, 0);
  }
}
