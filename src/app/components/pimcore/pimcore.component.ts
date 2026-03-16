import { Component, OnInit, inject, ChangeDetectorRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PimService, PimProduct } from '../../services/pim.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-pimcore',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pimcore.component.html',
  styleUrls: ['./pimcore.component.css']
})
export class ProductListComponent implements OnInit {
  private pimService = inject(PimService);
  private cdr = inject(ChangeDetectorRef);
  private searchService = inject(SearchService);

  loading = true;
  error = '';
  products: PimProduct[] = [];

  constructor() {
    effect(() => {
      const term = this.searchService.searchTerm();
      this.loadProducts(term);
    });
  }

  ngOnInit(): void {
    console.log('Pimcore component initialisé');
  }

  private loadProducts(term: string): void {
    this.loading = true;
    this.error = '';

    const search = term.trim();
    const first = search ? 20 : 30;

    console.log('Chargement produits avec :', { first, search });

    this.pimService.getProducts(first, search).subscribe({
      next: (res) => {
        console.log('Réponse API :', res);
        this.products = (res.products ?? []).filter(p => !!p.code?.trim());
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur API complète :', err);
        this.products = [];
        this.error = err?.error?.error || err?.message || 'Erreur lors du chargement des produits Pimcore';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}