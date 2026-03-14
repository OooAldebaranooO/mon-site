import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ProductListComponent } from "./components/pimcore/pimcore.component";
import { M3Component } from './components/m3/m3.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ProductListComponent, M3Component],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {}