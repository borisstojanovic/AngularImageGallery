import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ImagesComponent } from './images/images.component';
import { ImagesListComponent } from './images/images-list/images-list.component';
import { ImageEditComponent } from './images/image-edit/image-edit.component';
import { ImageDetailsComponent } from './images/image-details/image-details.component';
import { AuthComponent } from './auth/auth.component';
import { AuthLoginComponent } from './auth/auth-login/auth-login.component';
import { AuthSignupComponent } from './auth/auth-signup/auth-signup.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ImagesComponent,
    ImagesListComponent,
    ImageEditComponent,
    ImageDetailsComponent,
    AuthComponent,
    AuthLoginComponent,
    AuthSignupComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
