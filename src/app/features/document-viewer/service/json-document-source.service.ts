import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Document } from '../../../entities/model/document.interface';
import { DocumentSource } from '../model/document-source.interface';
import { DOCUMENT_PATH } from '../providers/document-source.provider';

@Injectable({
  providedIn: 'root',
})
export class JsonDocumentSourceService implements DocumentSource {
  private http = inject(HttpClient);
  private documentPath = inject(DOCUMENT_PATH);

  getDocument(): Observable<Document> {
    return this.http.get<Document>(this.documentPath);
  }
}
