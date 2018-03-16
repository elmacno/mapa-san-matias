import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { NavigationComponent } from './navigation/navigation.component'

export const routes: Routes = [
  { path: 'navigation/:lot_no', component: NavigationComponent },
  { path: '**', component: HomeComponent }
];
