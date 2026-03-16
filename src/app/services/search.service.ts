import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  searchTerm = signal('');

  setSearchTerm(term: string): void {
    this.searchTerm.set(term.trim().toLowerCase());
  }

  clear(): void {
    this.searchTerm.set('');
  }
}