import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService } from '@features/document-viewer/service/document.service';
import { DocumentStateService } from '@features/document-viewer/service/document-state.service';

@Component({
  selector: 'app-document-viewer',
  imports: [CommonModule],
  templateUrl: './document-viewer.component.html',
  styleUrl: './document-viewer.component.less',
})
export class DocumentViewerComponent {
  zoom = input.required<number>();

  private documentService = inject(DocumentService);
  public state = inject(DocumentStateService);

  constructor() {
    this.loadDocument();
  }

  private loadDocument() {
    this.documentService.loadDocument().subscribe();
  }
}
