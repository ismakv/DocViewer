export interface Annotation {
    id: string;
    text: string;
    position: {
        x: number;
        y: number;
    };
    pageNumber: number;
    isSaved?: boolean;
    selectionArea?: {
        x: number;
        y: number;
        width: number;
        height: number;
        pageNumber: number;
    };
}
