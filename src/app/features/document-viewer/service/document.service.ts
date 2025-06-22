import { Injectable, inject, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { shareReplay } from 'rxjs';
import { DOCUMENT_SOURCE } from '../providers/document-source.provider';
import { DocumentStateService } from './document-state.service';

@Injectable({
    providedIn: 'root',
})
export class DocumentService {
    private documentSource = inject(DOCUMENT_SOURCE);
    private state = inject(DocumentStateService);

    // Автоматически загружаем и обрабатываем документ через сигналы
    private documentLoaded = toSignal(
        this.documentSource.getDocument().pipe(
            shareReplay(1), // Делаем observable hot и кешируем результат
        ),
        { initialValue: null },
    );

    constructor() {
        console.log('DocumentService инициализирован');

        // Автоматически сохраняем документ в state при загрузке
        effect(() => {
            const document = this.documentLoaded();
            console.log('Документ загружен:', document);
            if (document) {
                this.state.setDocument(document);
                console.log('Документ сохранен в state');
            }
        });

        // Fallback: если toSignal не работает, используем старый подход
        setTimeout(() => {
            if (!this.state.document()) {
                console.log('Fallback: загружаем документ через subscribe');
                this.documentSource.getDocument().subscribe({
                    next: (document) => {
                        console.log('Fallback: документ загружен');
                        this.state.setDocument(document);
                    },
                    error: (error) => console.error('Fallback: ошибка загрузки', error),
                });
            }
        }, 1000);
    }
}
