"use strict";
function CanvasUtility() {

    var _this = this;

    var currentFrameObject = null;

    this.toolbarProps = {
        rectangle: {
            x: 0, y: 0, width: 48, height: 52
        },
        triangle: {
            width: 48, height: 52,
            position: { x: 24, y: 0 },
            line1: { x: 48, y: 52 },
            line2: { x: 0, y: 52 },
            line3: { x: 24, y: 0 }
        }
    };

    this.drawFrame = function (width, height) {
        var canvasElement = document.getElementById('greetingCanvas');
        canvasElement.width = width ? width : 500;
        canvasElement.height = height ? height : 600;
        canvasElement.style.boxShadow = "black 0px 0px 11px -8px";
        currentFrameObject = new fabric.Canvas('greetingCanvas');
        this.bindFrameEvents();
    }

    // Fabric object doesn't trigger drop events in normal way. You have to use "on" method to implement it.
    // https://stackoverflow.com/questions/49931874/cannot-catch-drag-events-in-fabricjs
    this.bindFrameEvents = function () {
        currentFrameObject.on('dragover', function (event) { return event.e.preventDefault(); }, false);
        currentFrameObject.on('drop', this.onFrameDrop, false);
    }

    this.getCurrentFrame = function () {
        return currentFrameObject;
    }

    this.initializeToolbar = function () {
        var toolbarObjects = {
            initRectable: function () {
                var tbrRect = document.getElementById("cRect");
                if (tbrRect && tbrRect.getContext) {
                    var context = tbrRect.getContext("2d");
                    var rect = _this.toolbarProps.rectangle;
                    context.rect(rect.x, rect.y, rect.width, rect.height);
                    context.stroke();
                }
                return this;
            },

            initTriangle: function () {
                var tbrRect = document.getElementById("cTra");
                if (tbrRect && tbrRect.getContext) {
                    var ctx = tbrRect.getContext('2d');
                    ctx.beginPath();
                    var tri = _this.toolbarProps.triangle;
                    ctx.moveTo(tri.position.x, tri.position.y);
                    ctx.lineTo(tri.line1.x, tri.line1.y);
                    ctx.lineTo(tri.line2.x, tri.line2.y);
                    ctx.lineTo(tri.line3.x, tri.line3.y);
                    ctx.fillStyle = '#FFCC00';
                    ctx.strokeStyle = '#666666';
                    ctx.stroke();
                    ctx.closePath();
                }
                return this;
            },
            initCircle: function () {
                return this;
            },
            initSquare: function () {
                return this;
            }
        };

        toolbarObjects.initRectable()
            .initTriangle()
            .initCircle()
            .initSquare();

    }

    this.init = function (width, height) {
        this.initializeToolbar();
        this.drawFrame(width, height);
    }

    this.onFrameDrop = function (event) {
        var element = event.e.dataTransfer.getData("control_data");

        element = element ? JSON.parse(element) : {};

        if (!element.name) {
            throw new Error('Invalid property received.!!');
        }

        var layerX = event.e.layerX, layerY = event.e.layerY;
        switch (element.name) {
            case 'rectangle':
                var rect = _this.toolbarProps.rectangle;

                _this.getCurrentFrame().add(new fabric.Rect({
                    width: rect.width, height: rect.height,
                    left: layerX, top: layerY,
                    fill: 'yellow',
                }));

                break;

            case 'triangle':
                var tri = _this.toolbarProps.triangle;

                _this.getCurrentFrame().add(new fabric.Triangle({
                    width: tri.width, height: tri.height, fill: 'blue', left: layerX, top: layerY
                }));
                break;
            default:
                break;
        }
    }

    this.onToolbarDragStart = function (event) {
        var target = event.target ? event.target : event.currentTarget;
        if (!target) {
            return;
        }
        var controlData = {
            name: target.attributes.name.value,
        };
        event.dataTransfer.setData("control_data", JSON.stringify(controlData));
    }
}


var canvasUtility = new CanvasUtility();
