import { Injectable, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { shareReplay, catchError, tap } from 'rxjs';
import { EMPTY } from 'rxjs';
import { DOCUMENT_SOURCE } from '../providers/document-source.provider';
import { DocumentStateService } from './document-state.service';

@Injectable({
    providedIn: 'root',
})
export class DocumentService {
    private documentSource = inject(DOCUMENT_SOURCE);
    private state = inject(DocumentStateService);
    private destroyRef = inject(DestroyRef);

    constructor() {
        this.loadDocument();
    }

    private loadDocument(): void {
        this.documentSource
            .getDocument()
            .pipe(
                tap((document) => {
                    this.state.setDocument(document);
                }),
                catchError((error) => {
                    console.error('Ошибка загрузки документа после всех попыток:', error);
                    return EMPTY;
                }),
                shareReplay(1),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }
}
