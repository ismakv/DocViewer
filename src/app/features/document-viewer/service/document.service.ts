import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { Document } from '../../../entities/model/document.interface';
import { DOCUMENT_SOURCE } from '../providers/document-source.provider';
import { DocumentStateService } from './document-state.service';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private documentSource = inject(DOCUMENT_SOURCE);
  private state = inject(DocumentStateService);

  loadDocument(): Observable<Document> {
    return this.documentSource.getDocument().pipe(tap((document) => this.state.setDocument(document)));
  }

  getDocument(): Observable<Document | null> {
    return toObservable(this.state.document);
  }

  getDocumentPages(): Observable<string[]> {
    return this.getDocument().pipe(map((document) => document?.pages.map((page) => page.imageUrl) ?? []));
  }
}
