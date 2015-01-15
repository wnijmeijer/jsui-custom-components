/// <reference path="././././././jquery.d.ts" />
declare module Coveo {
    interface MousePosition {
        clientX: number;
        clientY: number;
    }
    class Draggable {
        element: JQuery;
        static current: Draggable;
        static mouseOffset: {
            left: number;
            top: number;
        };
        private static delay;
        static mousemove(position: MousePosition): void;
        static mouseup(position: MousePosition): void;
        placeholder: JQuery;
        dragElement: JQuery;
        constructor(element: JQuery);
        createDragElement(): JQuery;
        removeDragElement(): void;
        dropElement(): JQuery;
        mousedown(position: MousePosition): void;
        mousemove(position: MousePosition): void;
        mouseup(position: MousePosition): void;
        dropIn(dropable: Dropable, before: JQuery): void;
        private setDragElementPosition(position);
        static centerOfDrag(position: MousePosition): MousePosition;
    }
    class Clonable extends Draggable {
        createDragElement(): JQuery;
        removeDragElement(): void;
        dropElement(): JQuery;
    }
    class Dropable {
        element: JQuery;
        accept: (element: JQuery) => boolean;
        static current: Dropable;
        static dropables: Dropable[];
        static elementFromPoint(position: MousePosition, _document?: Document): Element;
        static find(element: JQuery, position: MousePosition, _document?: Document): Dropable;
        constructor(element: JQuery, accept?: (element: JQuery) => boolean);
        elementAfter(position: MousePosition): JQuery;
        private getCenterOffset(element);
        private squareDistance(a, b);
    }
}
