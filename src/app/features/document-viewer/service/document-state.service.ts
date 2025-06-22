import { computed, Injectable, signal } from '@angular/core';
import { Document } from '@entities/model/document.interface';
import { DocumentState } from '../model/document-state.interface';

@Injectable({
  providedIn: 'root',
})
export class DocumentStateService {
  private state = signal<DocumentState>({
    document: null,
    zoom: 1,
  });

  readonly document = computed(() => this.state().document);
  readonly zoom = computed(() => this.state().zoom);

  setDocument(document: Document) {
    this.state.update((state) => ({ ...state, document }));
  }

  setZoom(zoom: number) {
    this.state.update((state) => ({ ...state, zoom }));
  }
}
