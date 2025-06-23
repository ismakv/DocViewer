import { Component, computed, inject, input, output, ChangeDetectionStrategy, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentStateService } from '../../service/document-state.service';
import { AnnotationService } from '../../service/annotation.service';
import { AnnotationComponent } from '../annotation/annotation.component';
import { AreaSelectionDirective, SelectionArea } from '../directives/area-selection.directive';
import { Page } from '@entities/model/document.interface';
import { HighlightData } from '../../model/highlight.interface';
import { AnnotationPositionChangeEvent, AnnotationTextChangeEvent } from '../../model/document-page-events.interface';

@Component({
    selector: 'app-document-page',
    imports: [CommonModule, AnnotationComponent, AreaSelectionDirective],
    templateUrl: './document-page.component.html',
    styleUrl: './document-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentPageComponent {
    page = input.required<Page>();
    currentSelection = input<SelectionArea | null>(null);

    updateAnnotationPosition = output<AnnotationPositionChangeEvent>();
    updateAnnotationText = output<AnnotationTextChangeEvent>();
    deleteAnnotation = output<string>();
    highlightClick = output<string>();
    selectionChange = output<SelectionArea>();
    selectionEnd = output<SelectionArea>();

    private state = inject(DocumentStateService);
    private annotationService = inject(AnnotationService);

    // Используем сервис вместо дублирования логики
    protected hasUnsavedAnnotation = this.annotationService.hasUnsavedAnnotation.bind(this.annotationService);

    // Метод для шаблона
    protected isAnnotationVisible(id: string): Signal<boolean> {
        return this.state.isAnnotationVisible(id);
    }

    protected getAnnotationsForPage = computed(() =>
        this.state.annotations().filter((a) => a.pageNumber === this.page().number),
    );

    protected getSavedHighlightsForPage = computed(() =>
        this.state
            .annotations()
            .filter((a) => a.pageNumber === this.page().number && a.selectionArea)
            .map((a) => ({
                id: a.id,
                selectionArea: a.selectionArea!,
                isSaved: a.isSaved,
            })),
    );

    protected onSelectionChange(selection: SelectionArea): void {
        this.selectionChange.emit(selection);
    }

    protected onSelectionEnd(selection: SelectionArea): void {
        this.selectionEnd.emit(selection);
    }

    protected getHighlightStyles(highlight: HighlightData): Record<string, string> {
        const { x, y, width, height } = highlight.selectionArea;
        return {
            left: x + 'px',
            top: y + 'px',
            width: width + 'px',
            height: height + 'px',
        };
    }

    protected getSelectionStyles(): Record<string, string> {
        const selection = this.currentSelection();
        if (!selection) return {};

        const { x, y, width, height } = selection;
        return {
            left: x + 'px',
            top: y + 'px',
            width: width + 'px',
            height: height + 'px',
        };
    }

    protected onHighlightInteraction(event: Event, highlightId: string): void {
        if (event.type === 'click' || (event.type === 'keydown' && (event as KeyboardEvent).key === 'Enter')) {
            this.highlightClick.emit(highlightId);
        }
    }
}
