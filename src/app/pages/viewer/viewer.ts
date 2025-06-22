import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiButton, TuiTitle } from '@taiga-ui/core';
import { TuiHeader } from '@taiga-ui/layout';
import { DocumentViewerComponent } from '../../features/document-viewer/ui/document-viewer/document-viewer.component';

@Component({
  selector: 'app-viewer-page',
  imports: [CommonModule, TuiButton, TuiHeader, TuiTitle, DocumentViewerComponent],
  templateUrl: './viewer.html',
  styleUrl: './viewer.less',
})
export class ViewerPage {
  zoom = signal(1);

  zoomIn() {
    this.zoom.set(Math.min(this.zoom() + 0.1, 2));
  }

  zoomOut() {
    this.zoom.set(Math.max(this.zoom() - 0.1, 0.5));
  }

  saveAnnotations() {
    console.log('Save');
  }
}
