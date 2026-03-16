import { Component, ChangeDetectorRef } from '@angular/core';
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
  error = '';

  constructor(
    private m3Service: M3Service,
    private cdr: ChangeDetectorRef
  ) {}

  testConnection(): void {
    this.error = '';
    this.result = null;

    this.m3Service.testConnection().subscribe({
      next: (res) => {
        this.result = res;
        console.log('Réponse API M3 :', res);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur complète API M3 :', err);
        console.error('status :', err?.status);
        console.error('message :', err?.message);
        console.error('error body :', err?.error);

        this.error = 'Erreur de connexion à l’API M3';
        this.cdr.detectChanges();
      }
    });
  }
}