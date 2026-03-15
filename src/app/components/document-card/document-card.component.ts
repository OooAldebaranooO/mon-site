import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DocumentItem } from '../../models/document.model';

@Component({
  selector: 'app-document-card',
  templateUrl: './document-card.component.html',
  styleUrls: ['./document-card.component.css']
})
export class DocumentCardComponent {
  @Input() document!: DocumentItem;

  @Output() view = new EventEmitter<DocumentItem>();
  @Output() download = new EventEmitter<DocumentItem>();

  onView(): void {
    this.view.emit(this.document);
  }

  onDownload(): void {
    this.download.emit(this.document);
  }
}