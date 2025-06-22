export interface HighlightData {
    id: string;
    selectionArea: { x: number; y: number; width: number; height: number; pageNumber: number };
    isSaved?: boolean;
}
