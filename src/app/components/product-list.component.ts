import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PimService, PimProduct } from '../services/pim.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  private pimService = inject(PimService);
  private cdr = inject(ChangeDetectorRef);

  private static nextId = 1;
  instanceId = ProductListComponent.nextId++;

  loading = true;
  error = '';
  products: PimProduct[] = [];

  ngOnInit(): void {
    console.log('INSTANCE ID =', this.instanceId);

    this.pimService.getProducts(30).subscribe({
    next: (res) => {
      console.log('INSTANCE', this.instanceId, 'Réponse API :', res);

      this.products = (res.products ?? []).filter(p => !!p.code?.trim());

      this.error = '';
      this.loading = false;
      this.cdr.detectChanges();

      console.log(
        'INSTANCE',
        this.instanceId,
        'loading =',
        this.loading,
        'products.length =',
        this.products.length
      );
    },
    error: (err) => {
      console.error('INSTANCE', this.instanceId, 'Erreur API :', err);
      this.error = 'Erreur lors du chargement des produits Pimcore';
      this.loading = false;
      this.cdr.detectChanges();
    }
  });
  }
}