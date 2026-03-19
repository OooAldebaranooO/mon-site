import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface RegisterPayload {
  displayName: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  data: {
    id: string;
    displayName: string;
    userPrincipalName?: string;
    email: string;
  };
}

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private http = inject(HttpClient);
  private baseUrl = environment.apis.azure;

  register(payload: RegisterPayload): Observable<RegisterResponse> {
  return this.http.post<RegisterResponse>(this.baseUrl, payload);
}
}