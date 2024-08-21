import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GenericErrorComponent } from './components/generic-error/generic-error.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ErrorInterceptor } from './services/error-interceptor.service';
import { InternalServerErrorComponent } from './components/internal-server-error/internal-server-error.component';



@NgModule({
  declarations: [
    PageNotFoundComponent,
    GenericErrorComponent,
    InternalServerErrorComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [RouterModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ]
})
export class ErrorsModule { }
