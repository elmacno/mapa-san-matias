import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatGridListModule } from '@angular/material/grid-list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';

import { MapboxService } from './mapbox.service';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatToolbarModule,
    MatSidenavModule,
    MatGridListModule,
    BrowserAnimationsModule
  ],
  exports: [
    MatToolbarModule,
    MatSidenavModule,
    MatGridListModule,
    BrowserAnimationsModule
  ],
  providers: [
    MapboxService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
