import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { M3Service } from '../../services/m3.service';

@Component({
  selector: 'app-m3',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './m3.component.html',
  styleUrls: ['./m3.component.css']
})
export class M3Component {
  result: any = null;
  error: string = '';

  constructor(private m3Service: M3Service) {}

  testConnection(): void {
    this.error = '';
    this.result = null;

    this.m3Service.testConnection().subscribe({
      next: (res) => {
        this.result = res;
      },
      error: (err) => {
        this.error = 'Erreur de connexion à l’API M3';
        console.error(err);
      }
    });
  }
}