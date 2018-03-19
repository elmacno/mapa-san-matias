import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { NavigationComponent } from './navigation/navigation.component'

export const routes: Routes = [
  {
    path: 'navigate/to/:lot_no',
    component: NavigationComponent
  },
  {
    path: 'navigate',
    component: NavigationComponent
  },
  {
    path: '**',
    component: HomeComponent
  }
];
