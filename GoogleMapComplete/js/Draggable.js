var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../lib/jquery.d.ts"/>
var Coveo;
(function (Coveo) {
    var _window = window;
    $(window).on('mousemove', function (e) { return Draggable.mousemove(e); });
    $(window).on('mouseup', function (e) { return Draggable.mouseup(e); });
    $(window.document).data('offset', { top: 0, left: 0 });
    var Delay = (function () {
        function Delay() {
        }
        Delay.call = function (callback, delay) {
            Delay.time = new Date().getTime() + delay;
            Delay.callback = callback;
            Delay.timeout = setTimeout(Delay.run, delay);
        };
        Delay.run = function () {
            if (Delay.callback != null && Delay.time != null && Delay.time <= new Date().getTime()) {
                clearTimeout(this.timeout);
                Delay.callback();
                Delay.callback = null;
                Delay.time = null;
                return true;
            }
            else {
                return false;
            }
        };
        Delay.cancel = function () {
            clearTimeout(this.timeout);
            Delay.callback = null;
            Delay.time != null;
        };
        return Delay;
    })();
    var Draggable = (function () {
        function Draggable(element) {
            var _this = this;
            this.element = element;
            this.element.addClass('coveo-draggable').mousedown(function (e) {
                if (e.which == 1) {
                    Delay.call(function () { return _this.mousedown(e); }, 300);
                }
            });
            this.placeholder = $('<div class="coveo-placeholder"/>');
        }
        Draggable.mousemove = function (position) {
            if (!Delay.run() && Draggable.current != null) {
                Draggable.current.mousemove(position);
            }
        };
        Draggable.mouseup = function (position) {
            Delay.cancel();
            if (Draggable.current != null) {
                Draggable.current.mouseup(position);
            }
        };
        Draggable.prototype.createDragElement = function () {
            var width = this.element.outerWidth();
            var height = this.element.outerHeight();
            var clone = this.element.clone().appendTo(this.element.get(0).ownerDocument.body).outerWidth(width).outerHeight(height).addClass('coveo-drag').css('position', 'fixed');
            this.element.addClass('coveo-dragging-origin');
            return clone;
        };
        Draggable.prototype.removeDragElement = function () {
            this.dragElement.detach();
            this.element.removeClass('coveo-dragging-origin');
        };
        Draggable.prototype.dropElement = function () {
            return this.element;
        };
        Draggable.prototype.mousedown = function (position) {
            var _this = this;
            Draggable.current = this;
            $.each(Dropable.dropables, function (i, dropable) {
                dropable.element.toggleClass('coveo-dropable', dropable.accept(_this.element));
            });
            $('body').addClass('coveo-dragging');
            $(_window.document).find('iframe').each(function (i, e) {
                $(e.contentDocument.body).addClass('coveo-dragging');
            });
            if (this.element.get(0).ownerDocument.parentWindow) {
                Draggable.mouseOffset = this.element.offset();
                Draggable.mouseOffset.left -= (position.clientX + this.element.get(0).ownerDocument.body.scrollLeft);
                Draggable.mouseOffset.top -= (position.clientY + this.element.get(0).ownerDocument.body.scrollTop);
            }
            this.dragElement = this.createDragElement();
            this.mousemove(position);
        };
        Draggable.prototype.mousemove = function (position) {
            var dropableCurrent = Dropable.current;
            var dragPosition = Draggable.centerOfDrag(position);
            this.setDragElementPosition(position);
            this.dragElement.css('display', 'none');
            var dropable = Dropable.current = Dropable.find(this.element, dragPosition);
            this.dragElement.css('display', '');
            if (dropable != null) {
                this.placeholder.appendTo(dropable.element);
                dropable.element.addClass('coveo-drop');
                this.placeholder.css({ 'max-width': '', 'max-height': '' });
                if (this.placeholder.css('max-width') == 'none') {
                    this.placeholder.css('max-width', this.dragElement.outerWidth());
                }
                if (this.placeholder.css('max-height') == 'none') {
                    this.placeholder.css('max-height', this.dragElement.outerHeight());
                }
                this.placeholder.detach();
                var element = dropable.elementAfter(dragPosition);
                if (element != null) {
                    this.placeholder.insertBefore(element);
                }
                else {
                    this.placeholder.appendTo(dropable.element);
                }
            }
            else {
                this.placeholder.detach();
            }
            if (dropableCurrent != null && dropableCurrent != Dropable.current) {
                dropableCurrent.element.removeClass('coveo-drop');
            }
        };
        Draggable.prototype.mouseup = function (position) {
            if (Dropable.current != null) {
                Dropable.current.element.removeClass('coveo-drop');
            }
            var dragPosition = Draggable.centerOfDrag(position);
            $('body').removeClass('coveo-dragging');
            $(_window.document).find('iframe').each(function (i, e) {
                $(e.contentDocument.body).removeClass('coveo-dragging');
            });
            this.dragElement.removeClass('coveo-drag');
            this.dragElement.css('display', 'none');
            var dropable = Dropable.find(this.element, dragPosition);
            this.dragElement.css('display', '');
            this.placeholder.detach();
            if (dropable != null) {
                var element = dropable.elementAfter(dragPosition);
                this.dropIn(dropable, element);
            }
            this.removeDragElement();
            this.dragElement = null;
            $.each(Dropable.dropables, function (i, dropable) {
                dropable.element.removeClass('coveo-dropable');
            });
            Draggable.current = null;
        };
        Draggable.prototype.dropIn = function (dropable, before) {
            var dropElement = this.dropElement();
            if (before != null) {
                dropElement.insertBefore(before);
            }
            else {
                dropElement.appendTo(dropable.element);
            }
            dropable.element.trigger('childChange', this);
        };
        Draggable.prototype.setDragElementPosition = function (position) {
            if (this.dragElement.parent().length == 0) {
                this.dragElement.insertAfter(this.element);
            }
            var cursorDocumentOffset = $(this.dragElement.get(0).ownerDocument).data('offset');
            var relativePosition = {
                clientX: position.clientX - cursorDocumentOffset.left,
                clientY: position.clientY - cursorDocumentOffset.top
            };
            this.dragElement.css({
                position: 'fixed',
                top: relativePosition.clientY + Draggable.mouseOffset.top,
                left: relativePosition.clientX + Draggable.mouseOffset.left,
                zIndex: 100000
            });
        };
        Draggable.centerOfDrag = function (position) {
            var dragElement = Draggable.current.dragElement;
            return {
                clientX: position.clientX + Draggable.mouseOffset.left + dragElement.outerWidth() / 2,
                clientY: position.clientY + Draggable.mouseOffset.top + dragElement.outerHeight() / 2
            };
        };
        return Draggable;
    })();
    Coveo.Draggable = Draggable;
    var Clonable = (function (_super) {
        __extends(Clonable, _super);
        function Clonable() {
            _super.apply(this, arguments);
        }
        Clonable.prototype.createDragElement = function () {
            var clone = this.element.clone().addClass('coveo-drag');
            Draggable.mouseOffset = {
                left: this.element.outerWidth() / -2,
                top: this.element.outerHeight() / -2
            };
            clone.css('position', 'fixed').appendTo(this.element.get(0).ownerDocument.body);
            return clone;
        };
        Clonable.prototype.removeDragElement = function () {
            this.dragElement.detach();
        };
        Clonable.prototype.dropElement = function () {
            return this.element.clone();
        };
        return Clonable;
    })(Draggable);
    Coveo.Clonable = Clonable;
    var Dropable = (function () {
        function Dropable(element, accept) {
            if (accept === void 0) { accept = function (element) { return true; }; }
            this.element = element;
            this.accept = accept;
            this.element.data('CoveoDropable', this);
            Dropable.dropables.push(this);
        }
        Dropable.elementFromPoint = function (position, _document) {
            if (_document === void 0) { _document = _window.document; }
            var element = _document.elementFromPoint(position.clientX, position.clientY);
            if (element != null) {
                if (element.tagName == 'IFRAME') {
                    var offset = $(element).offset();
                    return Dropable.elementFromPoint({ clientX: position.clientX - offset.left, clientY: position.clientY - offset.top }, element.contentDocument);
                }
            }
            return element;
        };
        Dropable.find = function (element, position, _document) {
            if (_document === void 0) { _document = _window.document; }
            var elementFromPoint = Dropable.elementFromPoint(position);
            if (elementFromPoint != null) {
                var over = $(elementFromPoint);
                while (!over.is('html')) {
                    var dropable = over.data('CoveoDropable');
                    if (dropable != null && dropable.accept(element)) {
                        return dropable;
                        break;
                    }
                    over = over.parent();
                }
            }
            return null;
        };
        Dropable.prototype.elementAfter = function (position) {
            var closestAfter;
            var squareDistance = Number.POSITIVE_INFINITY;
            var fakePlaceholder = Draggable.current.placeholder.clone(true, true);
            var dragOffset = this.getCenterOffset(Draggable.current.dragElement);
            var children = $(this.element).children();
            for (var i = 0; i < children.length; i++) {
                var child = children.get(i);
                if (child != Draggable.current.placeholder.get(0)) {
                    fakePlaceholder.insertBefore(child);
                    var phOffset = this.getCenterOffset(fakePlaceholder);
                    var distance = this.squareDistance(phOffset, dragOffset);
                    if (distance < squareDistance) {
                        squareDistance = distance;
                        closestAfter = $(child);
                    }
                }
            }
            if (closestAfter != null) {
                fakePlaceholder.appendTo(this.element);
                var phOffset = fakePlaceholder.offset();
                var distance = this.squareDistance(phOffset, dragOffset);
                if (distance < squareDistance) {
                    closestAfter = null;
                }
            }
            fakePlaceholder.detach();
            return closestAfter;
        };
        Dropable.prototype.getCenterOffset = function (element) {
            var offset = element.offset();
            offset.left += element.width() / 2;
            offset.top += element.height() / 2;
            var ownerDocumentOffset = $(element.get(0).ownerDocument).data('offset');
            if (ownerDocumentOffset != null) {
                offset.left += ownerDocumentOffset.left;
                offset.top += ownerDocumentOffset.top;
            }
            offset.top -= element.get(0).ownerDocument.body.scrollTop;
            offset.left -= element.get(0).ownerDocument.body.scrollLeft;
            return offset;
        };
        Dropable.prototype.squareDistance = function (a, b) {
            return Math.pow(a.left - b.left, 2) + Math.pow(a.top - b.top, 2);
        };
        Dropable.dropables = [];
        return Dropable;
    })();
    Coveo.Dropable = Dropable;
})(Coveo || (Coveo = {}));
