import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class M3Service {
  private http = inject(HttpClient);
  private baseUrl = environment.apis.m3;

  testConnection(): Observable<unknown> {
    return this.http.get(`${this.baseUrl}/`);
  }
}