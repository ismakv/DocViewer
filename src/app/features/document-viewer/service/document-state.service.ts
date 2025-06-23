import { computed, Injectable, signal, Signal } from '@angular/core';
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

    setDocument(document: Document): void {
        this.state.update((state) => ({ ...state, document }));
    }

    addAnnotation(annotation: Annotation): void {
        this.state.update((state) => ({
            ...state,
            annotations: [...state.annotations, annotation],
        }));
    }

    updateAnnotationPosition(id: string, position: { x: number; y: number }): void {
        this.state.update((state) => ({
            ...state,
            annotations: state.annotations.map((a) => (a.id === id ? { ...a, position } : a)),
        }));
    }

    updateAnnotationText(id: string, text: string): void {
        this.state.update((state) => ({
            ...state,
            annotations: state.annotations.map((a) => (a.id === id ? { ...a, text } : a)),
        }));
    }

    markAnnotationsAsSaved(): void {
        this.state.update((state) => ({
            ...state,
            annotations: state.annotations.map((a) => (!a.isSaved ? { ...a, isSaved: true } : a)),
        }));
    }

    deleteAnnotation(id: string): void {
        this.state.update((state) => ({
            ...state,
            annotations: state.annotations.filter((a) => a.id !== id),
        }));
    }

    showAnnotation(annotationId: string): void {
        this.state.update((state) => ({
            ...state,
            visibleAnnotations: [...state.visibleAnnotations, annotationId],
        }));
    }

    hideAnnotation(annotationId: string): void {
        this.state.update((state) => ({
            ...state,
            visibleAnnotations: state.visibleAnnotations.filter((id) => id !== annotationId),
        }));
    }

    isAnnotationVisible(annotationId: string): Signal<boolean> {
        return computed(() => this.state().visibleAnnotations.includes(annotationId));
    }
}
