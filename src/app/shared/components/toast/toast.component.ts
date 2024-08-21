import { Component } from '@angular/core';
import { ToastService } from 'shared/services/toast.service';


@Component({
  selector: 'toast',
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {
   constructor(public toastService: ToastService){

   }
}
