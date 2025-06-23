import { TestBed } from '@angular/core/testing';
import { AnnotationService } from './annotation.service';
import { DocumentStateService } from './document-state.service';
import { SelectionArea } from '../ui/directives/area-selection.directive';

describe('AnnotationService - Critical Tests', () => {
    let service: AnnotationService;
    let stateService: jasmine.SpyObj<DocumentStateService>;

    beforeEach(() => {
        const stateServiceSpy = jasmine.createSpyObj('DocumentStateService', [
            'addAnnotation',
            'showAnnotation',
            'annotations',
        ]);

        TestBed.configureTestingModule({
            providers: [AnnotationService, { provide: DocumentStateService, useValue: stateServiceSpy }],
        });

        service = TestBed.inject(AnnotationService);
        stateService = TestBed.inject(DocumentStateService) as jasmine.SpyObj<DocumentStateService>;
    });

    it('should create annotation from selection area', () => {
        spyOn(crypto, 'randomUUID').and.returnValue(
            '550e8400-e29b-41d4-a716-446655440000' as `${string}-${string}-${string}-${string}-${string}`,
        );

        const selection: SelectionArea = {
            x: 100,
            y: 200,
            width: 200,
            height: 100,
            pageNumber: 1,
        };

        service.createAnnotationFromSelection(selection);

        expect(stateService.addAnnotation).toHaveBeenCalledWith({
            id: '550e8400-e29b-41d4-a716-446655440000',
            text: 'Новая аннотация',
            position: { x: 200, y: 250 }, // Центр области
            pageNumber: 1,
            isSaved: false,
            selectionArea: selection,
        });

        expect(stateService.showAnnotation).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440000');
    });

    it('should detect unsaved annotations', () => {
        Object.defineProperty(stateService, 'annotations', {
            value: jasmine.createSpy().and.returnValue([
                { text: 'Saved annotation', isSaved: true },
                { text: 'Новая аннотация', isSaved: false },
            ]),
        });

        expect(service.hasUnsavedAnnotation()).toBe(true);
    });
});
