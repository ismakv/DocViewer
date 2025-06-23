import { Directive, ElementRef, inject, input, output, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, switchMap, takeUntil, map, filter } from 'rxjs';

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
export class AreaSelectionDirective {
    pageNumber = input.required<number>();
    disabled = input<boolean>(false);

    selectionStart = output<{ x: number; y: number; pageNumber: number }>();
    selectionChange = output<SelectionArea>();
    selectionEnd = output<SelectionArea>();

    private elementRef = inject(ElementRef);
    private destroyRef = inject(DestroyRef);

    constructor() {
        this.setupMouseSelection();
    }

    private setupMouseSelection(): void {
        const mouseDown$ = fromEvent<MouseEvent>(this.elementRef.nativeElement, 'mousedown');
        const mouseMove$ = fromEvent<MouseEvent>(document, 'mousemove');
        const mouseUp$ = fromEvent<MouseEvent>(document, 'mouseup');

        mouseDown$
            .pipe(
                // Фильтруем события если директива отключена
                filter(() => !this.disabled()),
                // Фильтруем клики на аннотациях и подсветках
                filter((event) => {
                    const target = event.target as HTMLElement;
                    return !target.closest('.annotation') && !target.closest('.annotation-highlight');
                }),
                // Трансформируем событие mousedown в начальные координаты
                map((event) => {
                    event.preventDefault();
                    const rect = this.elementRef.nativeElement.getBoundingClientRect();
                    return {
                        startX: event.clientX - rect.left,
                        startY: event.clientY - rect.top,
                        rect,
                    };
                }),
                // Для каждого mousedown создаем поток mousemove до mouseup
                switchMap(({ startX, startY, rect }) => {
                    // Эмитим событие начала выделения
                    this.selectionStart.emit({
                        x: startX,
                        y: startY,
                        pageNumber: this.pageNumber(),
                    });

                    // Создаем поток движения мыши до отпускания
                    const dragStream$ = mouseMove$.pipe(
                        // Прекращаем слушать mousemove при mouseup
                        takeUntil(mouseUp$),
                        // Трансформируем движения в области выделения
                        map((moveEvent) => {
                            const currentX = moveEvent.clientX - rect.left;
                            const currentY = moveEvent.clientY - rect.top;

                            const selection: SelectionArea = {
                                x: Math.min(currentX, startX),
                                y: Math.min(currentY, startY),
                                width: Math.abs(currentX - startX),
                                height: Math.abs(currentY - startY),
                                pageNumber: this.pageNumber(),
                            };

                            // Эмитим изменение выделения
                            this.selectionChange.emit(selection);
                            return selection;
                        }),
                    );

                    // Обрабатываем mouseup для эмита selectionEnd
                    const endStream$ = mouseUp$.pipe(
                        map((upEvent) => {
                            const currentX = upEvent.clientX - rect.left;
                            const currentY = upEvent.clientY - rect.top;

                            const finalSelection: SelectionArea = {
                                x: Math.min(currentX, startX),
                                y: Math.min(currentY, startY),
                                width: Math.abs(currentX - startX),
                                height: Math.abs(currentY - startY),
                                pageNumber: this.pageNumber(),
                            };

                            // Эмитим конец выделения с финальной областью
                            this.selectionEnd.emit(finalSelection);
                            return finalSelection;
                        }),
                    );

                    return dragStream$.pipe(
                        // Добавляем финальное событие selectionEnd
                        takeUntil(endStream$),
                    );
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }
}
