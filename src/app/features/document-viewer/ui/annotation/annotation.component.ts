import {
    Component,
    input,
    output,
    ChangeDetectionStrategy,
    DestroyRef,
    inject,
    ElementRef,
    AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, switchMap, takeUntil, map, filter } from 'rxjs';
import { Annotation } from '@entities/model/annotation.interface';

@Component({
    selector: 'app-annotation',
    imports: [CommonModule],
    templateUrl: './annotation.component.html',
    styleUrl: './annotation.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnotationComponent implements AfterViewInit {
    annotation = input.required<Annotation>();
    positionChange = output<{ id: string; position: { x: number; y: number } }>();
    textChange = output<{ id: string; text: string }>();
    delete = output<void>();

    private destroyRef = inject(DestroyRef);
    private elementRef = inject(ElementRef);

    ngAfterViewInit(): void {
        this.setupDragAndDrop();
    }

    private setupDragAndDrop(): void {
        const mouseDown$ = fromEvent<MouseEvent>(this.elementRef.nativeElement, 'mousedown');
        const mouseMove$ = fromEvent<MouseEvent>(document, 'mousemove');
        const mouseUp$ = fromEvent<MouseEvent>(document, 'mouseup');

        mouseDown$
            .pipe(
                // Игнорируем клики на textarea и кнопках
                filter((event) => {
                    const target = event.target as HTMLElement;
                    return target.tagName !== 'TEXTAREA' && target.tagName !== 'BUTTON';
                }),
                // Трансформируем mousedown в стартовые координаты
                map((event) => {
                    event.preventDefault();
                    return {
                        startX: event.clientX - this.annotation().position.x,
                        startY: event.clientY - this.annotation().position.y,
                    };
                }),
                // Для каждого mousedown создаем поток mousemove до mouseup
                switchMap(({ startX, startY }) => {
                    return mouseMove$.pipe(
                        // Прекращаем слушать mousemove при mouseup
                        takeUntil(mouseUp$),
                        // Трансформируем движения в новые позиции
                        map((moveEvent) => {
                            const newX = moveEvent.clientX - startX;
                            const newY = moveEvent.clientY - startY;

                            return {
                                id: this.annotation().id,
                                position: { x: newX, y: newY },
                            };
                        }),
                    );
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((positionData) => {
                this.positionChange.emit(positionData);
            });
    }

    onTextareaMouseDown(event: MouseEvent): void {
        event.stopPropagation();
    }

    onTextareaClick(event: MouseEvent): void {
        event.stopPropagation();
    }

    onTextChange(event: Event): void {
        const target = event.target as HTMLTextAreaElement;
        this.textChange.emit({
            id: this.annotation().id,
            text: target.value,
        });
    }

    onDelete(): void {
        this.delete.emit();
    }
}
