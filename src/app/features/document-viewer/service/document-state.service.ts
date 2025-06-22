import { computed, Injectable, signal } from '@angular/core';
import { Document } from '@entities/model/document.interface';
import { DocumentState } from '../model/document-state.interface';
import { Annotation } from '@entities/model/annotation.interface';

@Injectable({
    providedIn: 'root',
})
export class DocumentStateService {
    private state = signal<DocumentState>({
        document: null,
        annotations: [],
        visibleAnnotations: [],
    });

    readonly document = computed(() => this.state().document);
    readonly annotations = computed(() => this.state().annotations);

    setDocument(document: Document) {
        this.state.update((state) => ({ ...state, document }));
    }

    addAnnotation(annotation: Annotation) {
        this.state.update((state) => ({
            ...state,
            annotations: [...state.annotations, annotation],
        }));
    }

    updateAnnotationPosition(id: string, position: { x: number; y: number }) {
        this.state.update((state) => ({
            ...state,
            annotations: state.annotations.map((a) => (a.id === id ? { ...a, position } : a)),
        }));
    }

    updateAnnotationText(id: string, text: string) {
        this.state.update((state) => ({
            ...state,
            annotations: state.annotations.map((a) => (a.id === id ? { ...a, text } : a)),
        }));
    }

    markAnnotationsAsSaved() {
        this.state.update((state) => ({
            ...state,
            annotations: state.annotations.map((a) => (!a.isSaved ? { ...a, isSaved: true } : a)),
        }));
    }

    deleteAnnotation(id: string) {
        this.state.update((state) => ({
            ...state,
            annotations: state.annotations.filter((a) => a.id !== id),
        }));
    }

    showAnnotation(annotationId: string) {
        this.state.update((state) => ({
            ...state,
            visibleAnnotations: [...state.visibleAnnotations, annotationId],
        }));
    }

    hideAnnotation(annotationId: string) {
        this.state.update((state) => ({
            ...state,
            visibleAnnotations: state.visibleAnnotations.filter((id) => id !== annotationId),
        }));
    }

    isAnnotationVisible(annotationId: string) {
        return computed(() => this.state().visibleAnnotations.includes(annotationId));
    }
}
