import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService } from '@features/document-viewer/service/document.service';
import { DocumentStateService } from '@features/document-viewer/service/document-state.service';
import { AnnotationComponent } from '../annotation/annotation.component';

@Component({
  selector: 'app-document-viewer',
  imports: [CommonModule, AnnotationComponent],
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
