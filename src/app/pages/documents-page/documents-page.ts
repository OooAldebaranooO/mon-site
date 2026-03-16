import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentCardComponent } from '../../components/document-card/document-card.component';
import { DocumentItem } from '../../models/document.model';

@Component({
  selector: 'app-documents-page',
  standalone: true,
  imports: [CommonModule, DocumentCardComponent],
  templateUrl: './documents-page.html',
  styleUrl: './documents-page.css'
})
export class DocumentsPageComponent {
  documents: DocumentItem[] = [
    {
      id: 1,
      title: 'Conditions générales',
      description: 'Document des conditions générales de vente.',
      date: '14/03/2026',
      viewUrl: '/assets/docs/cgv.pdf',
      downloadUrl: '/assets/docs/cgv.pdf'
    },
    {
      id: 2,
      title: 'Catalogue produit',
      description: 'Catalogue complet des produits.',
      date: '12/03/2026',
      viewUrl: '/assets/docs/catalogue.pdf',
      downloadUrl: '/assets/docs/catalogue.pdf'
    },
    {
      id: 3,
      title: 'Guide client',
      description: 'Guide d’utilisation pour les clients.',
      date: '10/03/2026',
      viewUrl: '/assets/docs/guide.pdf',
      downloadUrl: '/assets/docs/guide.pdf'
    },
    {
      id: 4,
      title: 'Guide client',
      description: 'Guide d’utilisation pour les clients.',
      date: '10/03/2026',
      viewUrl: '/assets/docs/guide.pdf',
      downloadUrl: '/assets/docs/guide.pdf'
    },
    {
      id: 5,
      title: 'Guide client',
      description: 'Guide d’utilisation pour les clients.',
      date: '10/03/2026',
      viewUrl: '/assets/docs/guide.pdf',
      downloadUrl: '/assets/docs/guide.pdf'
    },
    {
      id: 6,
      title: 'Guide client',
      description: 'Guide d’utilisation pour les clients.',
      date: '10/03/2026',
      viewUrl: '/assets/docs/guide.pdf',
      downloadUrl: '/assets/docs/guide.pdf'
    }
  ];

  onViewDocument(doc: DocumentItem): void {
    window.open(doc.viewUrl, '_blank');
  }

  onDownloadDocument(doc: DocumentItem): void {
    window.open(doc.downloadUrl, '_blank');
  }
}