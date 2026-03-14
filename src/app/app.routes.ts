import { Routes } from '@angular/router';
import { ProductListComponent } from './components/pimcore/pimcore.component';
import { M3Component } from './components/m3/m3.component';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'pimcore',
    pathMatch: 'full'
  },

  {
    path: 'pimcore',
    component: ProductListComponent
  },

  {
    path: 'm3',
    component: M3Component
  }

];