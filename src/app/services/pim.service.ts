import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

export interface PimProduct {
  code: string | null;
  designation: string | null;
  statut: string | null;
  creationDate: number | null;
  modificationDate: number | null;
  marque: {
    label: string | null;
    logo: string | null;
  } | null;
  erpSegmentation: {
    nom: string | null;
    code: string | null;
  } | null;
}

export interface PimProductsResponse {
  ok: boolean;
  count: number;
  products: PimProduct[];
}

@Injectable({
  providedIn: 'root'
})
export class PimService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api/pim_products.php';

  getProducts(first: number = 30, filter: string = ''): Observable<PimProductsResponse> {

    let params = new HttpParams().set('first', first);

    if (filter.trim() !== '') {
      params = params.set('filter', filter.trim());
    }

    return this.http
      .get<PimProductsResponse>(this.apiUrl, { params })
      .pipe(
        timeout(10000)
      );
  }
}