import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { routes } from './app.routes';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { NavigationComponent } from './navigation/navigation.component';
import { HomeComponent } from './home/home.component';

import { MapboxService } from './mapbox.service';
import { LocationService } from './location.service';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    NavigationComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatToolbarModule,
    MatSidenavModule,
    MatGridListModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    MatToolbarModule,
    MatSidenavModule,
    MatGridListModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    BrowserAnimationsModule
  ],
  providers: [
    MapboxService,
    LocationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
