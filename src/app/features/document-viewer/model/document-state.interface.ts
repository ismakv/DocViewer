import { Document } from '@entities/model/document.interface';

export interface DocumentState {
  document: Document | null;
  zoom: number;
}
