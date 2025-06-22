import { Component } from '@angular/core';
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
  zoomIn() {
    console.log('Zoom in');
  }

  zoomOut() {
    console.log('Zoom out');
  }

  saveAnnotations() {
    console.log('Save');
  }
}
