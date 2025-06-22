import { InjectionToken } from '@angular/core';
import { DocumentSource } from '../model/document-source.interface';

export const DOCUMENT_SOURCE = new InjectionToken<DocumentSource>('DocumentSource');
export const DOCUMENT_PATH = new InjectionToken<string>('DocumentPath');
