import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Annotation } from '@entities/model/annotation.interface';

@Component({
    selector: 'app-annotation',
    imports: [CommonModule],
    templateUrl: './annotation.component.html',
    styleUrl: './annotation.component.less',
})
export class AnnotationComponent {
    annotation = input.required<Annotation>();
    positionChange = output<{ id: string; position: { x: number; y: number } }>();
    textChange = output<{ id: string; text: string }>();
    delete = output<void>();

    private isDragging = false;
    private startX = 0;
    private startY = 0;

    onMouseDown(event: MouseEvent) {
        if ((event.target as HTMLElement).tagName === 'TEXTAREA') {
            return;
        }

        event.preventDefault();
        this.isDragging = true;
        this.startX = event.clientX - this.annotation().position.x;
        this.startY = event.clientY - this.annotation().position.y;

        const mouseMoveHandler = (e: MouseEvent) => {
            if (this.isDragging) {
                const newX = e.clientX - this.startX;
                const newY = e.clientY - this.startY;

                this.positionChange.emit({
                    id: this.annotation().id,
                    position: { x: newX, y: newY },
                });
            }
        };

        const mouseUpHandler = () => {
            this.isDragging = false;
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    }

    onTextareaMouseDown(event: MouseEvent) {
        event.stopPropagation();
    }

    onTextareaClick(event: MouseEvent) {
        event.stopPropagation();
    }

    onTextChange(event: Event) {
        const target = event.target as HTMLTextAreaElement;
        this.textChange.emit({
            id: this.annotation().id,
            text: target.value,
        });
    }

    onDelete() {
        this.delete.emit();
    }
}
