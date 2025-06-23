import { Component, inject, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentPageComponent } from '../document-page/document-page.component';
import { DocumentService } from '../../service/document.service';
import { DocumentStateService } from '../../service/document-state.service';
import { AnnotationService } from '../../service/annotation.service';
import { SelectionArea } from '../directives/area-selection.directive';
import { AnnotationPositionChangeEvent, AnnotationTextChangeEvent } from '../../model/document-page-events.interface';

@Component({
    selector: 'app-document-viewer',
    imports: [CommonModule, DocumentPageComponent],
    templateUrl: './document-viewer.component.html',
    styleUrl: './document-viewer.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentViewerComponent {
    zoom = input.required<number>();

    protected documentService = inject(DocumentService);
    protected state = inject(DocumentStateService);
    private annotationService = inject(AnnotationService);

    protected currentSelection = signal<SelectionArea | null>(null);

    constructor() {
        console.log('DocumentViewerComponent создан, DocumentService:', !!this.documentService);
    }

    protected onSelectionChange(selection: SelectionArea) {
        this.currentSelection.set(selection);
    }

    protected onSelectionEnd(selection: SelectionArea) {
        this.currentSelection.set(null);
        this.annotationService.createAnnotationFromSelection(selection);
    }

    protected updateAnnotationPosition(event: AnnotationPositionChangeEvent) {
        this.state.updateAnnotationPosition(event.id, event.position);
    }

    protected updateAnnotationText(event: AnnotationTextChangeEvent) {
        this.state.updateAnnotationText(event.id, event.text);
    }

    protected deleteAnnotation(id: string) {
        this.state.deleteAnnotation(id);
    }

    protected onHighlightClick(id: string) {
        this.annotationService.toggleAnnotationVisibility(id);
    }
}
