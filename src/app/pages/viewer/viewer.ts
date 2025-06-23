import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiButton, TuiTitle } from '@taiga-ui/core';
import { TuiHeader } from '@taiga-ui/layout';
import { DocumentViewerComponent } from '../../features/document-viewer/ui/document-viewer/document-viewer.component';
import { DocumentStateService } from '../../features/document-viewer/service/document-state.service';

@Component({
    selector: 'app-viewer-page',
    imports: [CommonModule, TuiButton, TuiHeader, TuiTitle, DocumentViewerComponent],
    templateUrl: './viewer.html',
    styleUrl: './viewer.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewerPage {
    zoom = signal(1);
    private stateService = inject(DocumentStateService);

    zoomIn() {
        this.zoom.set(Math.min(this.zoom() + 0.1, 2));
    }

    zoomOut() {
        this.zoom.set(Math.max(this.zoom() - 0.1, 0.5));
    }

    saveAnnotations() {
        this.stateService.markAnnotationsAsSaved();

        const document = this.stateService.document();
        const annotations = this.stateService.annotations();

        console.log('Документ с аннотациями:', {
            document: document,
            annotations: annotations,
            totalAnnotations: annotations.length,
            savedAnnotations: annotations.filter((a) => a.isSaved === true).length,
            newAnnotations: annotations.filter((a) => a.isSaved !== true).length,
        });
    }
}
