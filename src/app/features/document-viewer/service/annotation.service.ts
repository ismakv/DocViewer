import { Injectable, inject } from '@angular/core';
import { DocumentStateService } from './document-state.service';
import { Annotation } from '@entities/model/annotation.interface';
import { SelectionArea } from '../ui/directives/area-selection.directive';

@Injectable({
    providedIn: 'root',
})
export class AnnotationService {
    private state = inject(DocumentStateService);

    hasUnsavedAnnotation(): boolean {
        const annotations = this.state.annotations();
        return annotations.some((a) => a.text === 'Новая аннотация');
    }

    createAnnotationFromSelection(selection: SelectionArea): void {
        // Создаем аннотацию в центре выделенной области
        const centerX = selection.x + selection.width / 2;
        const centerY = selection.y + selection.height / 2;

        const newAnnotation: Annotation = {
            id: crypto.randomUUID(),
            text: 'Новая аннотация',
            position: { x: centerX, y: centerY },
            pageNumber: selection.pageNumber,
            isSaved: false,
            selectionArea: {
                x: selection.x,
                y: selection.y,
                width: selection.width,
                height: selection.height,
                pageNumber: selection.pageNumber,
            },
        };

        this.state.addAnnotation(newAnnotation);
        this.state.showAnnotation(newAnnotation.id);
    }

    toggleAnnotationVisibility(annotationId: string): void {
        const isVisible = this.state.isAnnotationVisible(annotationId)();
        if (isVisible) {
            this.state.hideAnnotation(annotationId);
        } else {
            this.state.showAnnotation(annotationId);
        }
    }
}
