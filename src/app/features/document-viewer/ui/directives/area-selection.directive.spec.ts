import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { AreaSelectionDirective } from './area-selection.directive';

@Component({
    template: `
        <div
            appAreaSelection
            [pageNumber]="pageNumber()"
            [disabled]="disabled()"
            (selectionEnd)="onSelectionEnd($event)"
            style="width: 400px; height: 300px; position: relative;"></div>
    `,
    standalone: true,
    imports: [AreaSelectionDirective],
})
class TestHostComponent {
    pageNumber = signal(1);
    disabled = signal(false);
    onSelectionEnd = jasmine.createSpy('onSelectionEnd');
}

describe('AreaSelectionDirective - Critical Tests', () => {
    let component: TestHostComponent;
    let fixture: ComponentFixture<TestHostComponent>;
    let directiveEl: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
        directiveEl = fixture.nativeElement.querySelector('[appAreaSelection]');

        // Мокаем getBoundingClientRect
        spyOn(directiveEl, 'getBoundingClientRect').and.returnValue({
            left: 0,
            top: 0,
            width: 400,
            height: 300,
        } as DOMRect);

        fixture.detectChanges();
    });

    it('should create selection area from mouse events', () => {
        const mouseDownEvent = new MouseEvent('mousedown', {
            clientX: 100,
            clientY: 150,
            bubbles: true,
        });

        directiveEl.dispatchEvent(mouseDownEvent);

        const mouseMoveEvent = new MouseEvent('mousemove', {
            clientX: 200,
            clientY: 250,
            bubbles: true,
        });

        document.dispatchEvent(mouseMoveEvent);

        const mouseUpEvent = new MouseEvent('mouseup', {
            clientX: 200,
            clientY: 250,
            bubbles: true,
        });

        document.dispatchEvent(mouseUpEvent);

        expect(component.onSelectionEnd).toHaveBeenCalledWith({
            x: 100,
            y: 150,
            width: 100,
            height: 100,
            pageNumber: 1,
        });
    });

    it('should not start selection when disabled', () => {
        component.disabled.set(true);
        fixture.detectChanges();

        const mouseDownEvent = new MouseEvent('mousedown', {
            clientX: 100,
            clientY: 150,
            bubbles: true,
        });

        directiveEl.dispatchEvent(mouseDownEvent);

        const mouseUpEvent = new MouseEvent('mouseup', {
            clientX: 150,
            clientY: 200,
            bubbles: true,
        });

        document.dispatchEvent(mouseUpEvent);

        expect(component.onSelectionEnd).not.toHaveBeenCalled();
    });
});
