import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ProductListComponent } from "./components/pimcore/pimcore.component";
import { M3Component } from './components/m3/m3.component';
import { DocumentsPageComponent } from './pages/documents-page/documents-page';
import { SearchRotatingPlaceholderComponent } from './components/search-rotating-placeholder/search-rotating-placeholder.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ProductListComponent, M3Component, DocumentsPageComponent, SearchRotatingPlaceholderComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {}