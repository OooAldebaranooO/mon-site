import { Routes } from '@angular/router';
import { ProductListComponent } from './components/pimcore/pimcore.component';
import { M3Component } from './components/m3/m3.component';
import { DocumentsPageComponent } from './pages/documents-page/documents-page';
import { SearchRotatingPlaceholderComponent } from './components/search-rotating-placeholder/search-rotating-placeholder.component';
import { RegisterComponent } from './pages/register/register';

export const routes: Routes = [

  {
    path: 'search-rotating-placeholder',
    component: SearchRotatingPlaceholderComponent
  },

  {
    path: 'pimcore',
    component: ProductListComponent
  },

  {
    path: 'm3',
    component: M3Component
  },

  {
    path: 'documents',
    component: DocumentsPageComponent
  },

  { path: 'register',
    component: RegisterComponent
  }
];