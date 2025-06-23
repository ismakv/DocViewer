import { TestBed } from '@angular/core/testing';
import { DocumentService } from './document.service';
import { DocumentStateService } from './document-state.service';
import { DOCUMENT_SOURCE } from '../providers/document-source.provider';
import { DocumentSource } from '../model/document-source.interface';
import { Document } from '@entities/model/document.interface';
import { of, throwError } from 'rxjs';

describe('DocumentService - Critical Tests', () => {
    let mockDocumentSource: jasmine.SpyObj<DocumentSource>;
    let mockStateService: jasmine.SpyObj<DocumentStateService>;

    const mockDocument: Document = {
        name: 'Test Document',
        pages: [{ number: 1, imageUrl: 'page1.png' }],
    };

    beforeEach(() => {
        const documentSourceSpy = jasmine.createSpyObj('DocumentSource', ['getDocument']);
        const stateServiceSpy = jasmine.createSpyObj('DocumentStateService', ['setDocument']);

        TestBed.configureTestingModule({
            providers: [
                DocumentService,
                { provide: DOCUMENT_SOURCE, useValue: documentSourceSpy },
                { provide: DocumentStateService, useValue: stateServiceSpy },
            ],
        });

        mockDocumentSource = TestBed.inject(DOCUMENT_SOURCE) as jasmine.SpyObj<DocumentSource>;
        mockStateService = TestBed.inject(DocumentStateService) as jasmine.SpyObj<DocumentStateService>;
    });

    it('should load document successfully and save to state', () => {
        mockDocumentSource.getDocument.and.returnValue(of(mockDocument));

        TestBed.inject(DocumentService); // Инициализируем сервис

        expect(mockDocumentSource.getDocument).toHaveBeenCalled();
        expect(mockStateService.setDocument).toHaveBeenCalledWith(mockDocument);
    });

    it('should handle loading errors gracefully', () => {
        const consoleErrorSpy = spyOn(console, 'error');
        mockDocumentSource.getDocument.and.returnValue(throwError(() => new Error('Network error')));

        TestBed.inject(DocumentService); // Инициализируем сервис

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Ошибка загрузки документа после всех попыток:',
            jasmine.any(Error),
        );
    });
});
