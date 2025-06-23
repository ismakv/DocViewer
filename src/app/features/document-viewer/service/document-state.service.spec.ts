import { TestBed } from '@angular/core/testing';
import { DocumentStateService } from './document-state.service';
import { Annotation } from '@entities/model/annotation.interface';

describe('DocumentStateService - Critical Tests', () => {
    let service: DocumentStateService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DocumentStateService);
    });

    it('should add and retrieve annotations', () => {
        const annotation: Annotation = {
            id: 'test-id',
            text: 'Test annotation',
            position: { x: 100, y: 200 },
            pageNumber: 1,
        };

        service.addAnnotation(annotation);
        expect(service.annotations().length).toBe(1);
        expect(service.annotations()[0]).toEqual(annotation);
    });

    it('should update annotation position', () => {
        const annotation: Annotation = {
            id: 'test-id',
            text: 'Test annotation',
            position: { x: 100, y: 200 },
            pageNumber: 1,
        };

        service.addAnnotation(annotation);
        service.updateAnnotationPosition('test-id', { x: 300, y: 400 });

        const updated = service.annotations().find((a) => a.id === 'test-id');
        expect(updated?.position).toEqual({ x: 300, y: 400 });
    });

    it('should manage annotation visibility', () => {
        expect(service.isAnnotationVisible('test-id')()).toBe(false);

        service.showAnnotation('test-id');
        expect(service.isAnnotationVisible('test-id')()).toBe(true);

        service.hideAnnotation('test-id');
        expect(service.isAnnotationVisible('test-id')()).toBe(false);
    });
});
