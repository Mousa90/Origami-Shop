import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RouterModule } from '@angular/router';
import { ToastComponent } from 'shared/components/toast/toast.component';
import { SharedModule } from 'shared/shared.module';

import { environment } from '../environments/environment';
import { AdminModule } from './admin/admin.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './core/components/home/home.component';
import { LoginComponent } from './core/components/login/login.component';
import { CoreModule } from './core/core.module';
import { GenericErrorComponent } from './errors/components/generic-error/generic-error.component';
import { PageNotFoundComponent } from './errors/components/page-not-found/page-not-found.component';
import { ErrorsModule } from './errors/errors.module';
import { ShoppingModule } from './shopping/shopping.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './errors/services/error-interceptor.service';
import { InternalServerErrorComponent } from './errors/components/internal-server-error/internal-server-error.component';
import { GlobalErrorHandler } from './errors/services/global-error-handle.service';

@NgModule({
  declarations: [
    AppComponent,
    ToastComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AdminModule,
    ShoppingModule,
    CoreModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    RouterModule.forRoot([
      {path: '', component: HomeComponent},
      {path: 'login', component: LoginComponent},
      {path: 'error', component: GenericErrorComponent}, 
      {path: '500', component: InternalServerErrorComponent}, // Route for 500 error
      {path: '**', component: PageNotFoundComponent} // Wildcard route for 404 page
    ]),
    ErrorsModule,
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
