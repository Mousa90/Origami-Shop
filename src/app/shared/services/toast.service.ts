import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  public showToast: boolean = false;
  public toastStatus: string = "";
  public toastText: string = "";

  constructor() { }

  public toast( toastStatus: string, toastText: string) {
    this.showToast = true;
    this.toastStatus = toastStatus;
    this.toastText = toastText;
  }
}
