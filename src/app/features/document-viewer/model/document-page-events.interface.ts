export interface AnnotationPositionChangeEvent {
    id: string;
    position: { x: number; y: number };
}

export interface AnnotationTextChangeEvent {
    id: string;
    text: string;
}
