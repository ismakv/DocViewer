import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Document } from '../../../entities/model/document.interface';
import { DOCUMENT_SOURCE } from '../providers/document-source.provider';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private documentSource = inject(DOCUMENT_SOURCE);

  getDocumentPages(): Observable<string[]> {
    return this.getDocument().pipe(map((document) => document?.pages.map((page) => page.imageUrl) ?? []));
  }

  private getDocument(): Observable<Document> {
    return this.documentSource.getDocument();
  }
}
