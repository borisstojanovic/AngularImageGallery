import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ImagesComponent } from './images/images.component';
import { ImagesListComponent } from './images/images-list/images-list.component';
import { ImageEditComponent } from './images/image-edit/image-edit.component';
import { ImageDetailsComponent } from './images/image-details/image-details.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ImagesComponent,
    ImagesListComponent,
    ImageEditComponent,
    ImageDetailsComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
