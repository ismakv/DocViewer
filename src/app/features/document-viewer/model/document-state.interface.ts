import { Annotation } from '@entities/model/annotation.interface';
import { Document } from '@entities/model/document.interface';

export interface DocumentState {
    document: Document | null;
    annotations: Annotation[];
    visibleAnnotations: string[];
}
