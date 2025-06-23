import { Directive, ElementRef, inject, input, output, OnDestroy } from '@angular/core';

export interface SelectionArea {
    x: number;
    y: number;
    width: number;
    height: number;
    pageNumber: number;
}

@Directive({
    selector: '[appAreaSelection]',
})
export class AreaSelectionDirective implements OnDestroy {
    pageNumber = input.required<number>();
    disabled = input<boolean>(false);

    selectionStart = output<{ x: number; y: number; pageNumber: number }>();
    selectionChange = output<SelectionArea>();
    selectionEnd = output<SelectionArea>();

    private elementRef = inject(ElementRef);
    private isSelecting = false;
    private selectionStartPos = { x: 0, y: 0 };
    private currentSelection = { x: 0, y: 0, width: 0, height: 0, pageNumber: 0 };
    private currentMouseMoveHandler?: (e: MouseEvent) => void;
    private currentMouseUpHandler?: () => void;

    constructor() {
        this.elementRef.nativeElement.addEventListener('mousedown', this.onMouseDown.bind(this));
    }

    private onMouseDown(event: MouseEvent): void {
        if (this.disabled()) return;

        event.preventDefault();

        // Проверяем, что клик не был на аннотации или подсветке
        const target = event.target as HTMLElement;
        if (target.closest('.annotation') || target.closest('.annotation-highlight')) {
            return;
        }

        const rect = this.elementRef.nativeElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        this.isSelecting = true;
        this.selectionStartPos = { x, y };
        this.currentSelection = { x, y, width: 0, height: 0, pageNumber: this.pageNumber() };

        this.selectionStart.emit({ x, y, pageNumber: this.pageNumber() });

        // Добавляем обработчики событий мыши
        this.currentMouseMoveHandler = (e: MouseEvent): void => this.onMouseMove(e);
        this.currentMouseUpHandler = (): void => this.onMouseUp();

        document.addEventListener('mousemove', this.currentMouseMoveHandler);
        document.addEventListener('mouseup', this.currentMouseUpHandler);
    }

    private onMouseMove(event: MouseEvent): void {
        if (!this.isSelecting) return;

        const rect = this.elementRef.nativeElement.getBoundingClientRect();
        const currentX = event.clientX - rect.left;
        const currentY = event.clientY - rect.top;

        // Обновляем размеры выделения
        this.currentSelection.width = Math.abs(currentX - this.selectionStartPos.x);
        this.currentSelection.height = Math.abs(currentY - this.selectionStartPos.y);
        this.currentSelection.x = Math.min(currentX, this.selectionStartPos.x);
        this.currentSelection.y = Math.min(currentY, this.selectionStartPos.y);

        this.selectionChange.emit({ ...this.currentSelection });
    }

    private onMouseUp(): void {
        if (!this.isSelecting) return;

        this.isSelecting = false;

        // Удаляем обработчики событий
        this.removeEventListeners();

        this.selectionEnd.emit({ ...this.currentSelection });

        // Сбрасываем выделение
        this.currentSelection = { x: 0, y: 0, width: 0, height: 0, pageNumber: 0 };
    }

    private removeEventListeners(): void {
        if (this.currentMouseMoveHandler) {
            document.removeEventListener('mousemove', this.currentMouseMoveHandler);
            this.currentMouseMoveHandler = undefined;
        }
        if (this.currentMouseUpHandler) {
            document.removeEventListener('mouseup', this.currentMouseUpHandler);
            this.currentMouseUpHandler = undefined;
        }
    }

    ngOnDestroy(): void {
        this.removeEventListeners();
    }
}
