import { Observable } from 'rxjs';
import { Document } from '../../../entities/model/document.interface';

export interface DocumentSource {
  getDocument(): Observable<Document>;
}
