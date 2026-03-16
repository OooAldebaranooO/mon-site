import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class M3Service {
  private apiUrl = 'https://mon-site-api-m3-e4dxbxczeqhef0hm.francecentral-01.azurewebsites.net';

  constructor(private http: HttpClient) {}

  testConnection(): Observable<any> {
  return this.http.get(`${this.apiUrl}/`);
}
}