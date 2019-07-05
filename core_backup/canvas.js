"use strict";
function CanvasUtility() {
    var _this = this;

    var currentFrameObject = null;
    var utils = new Utils();

    this.toolbarProps = {
        rectangle: {
            x: 0,
            y: 0,
            width: 48,
            height: 52
        },
        triangle: {
            width: 48,
            height: 52,
            position: { x: 24, y: 0 },
            line1: { x: 48, y: 52 },
            line2: { x: 0, y: 52 },
            line3: { x: 24, y: 0 }
        }
    };

    this.drawFrame = function (width, height) {
        var canvasElement = document.getElementById("greetingCanvas");
        canvasElement.width = width ? width : 500;
        canvasElement.height = height ? height : 600;
        canvasElement.style.border = "1px solid lightgrey";
        currentFrameObject = new fabric.Canvas("greetingCanvas");
        this.bindFrameEvents();
    };

    // Fabric object doesn't trigger drop events in normal way. You have to use "on" method to implement it.
    // https://stackoverflow.com/questions/49931874/cannot-catch-drag-events-in-fabricjs
    this.bindFrameEvents = function () {
        currentFrameObject.on(
            "dragover",
            function (event) {
                return event.e.preventDefault();
            },
            false
        );
        currentFrameObject.on("drop", this.onFrameDrop, false);
    };

    this.getCurrentFrame = function () {
        return currentFrameObject;
    };

    this.init = function () {

        var queryString = utils.searchToObject();
        var matches = /([\d]+)x([\d]+)/gm.exec(queryString.dimention);

        this.drawFrame(matches[1], matches[2]);
    };

    this.onFrameDrop = function (event) {
        var element = event.e.dataTransfer.getData("control_data");

        element = element ? JSON.parse(element) : {};

        if (!element.name) {
            throw new Error("Invalid property received.!!");
        }

        var layerX = event.e.layerX,
            layerY = event.e.layerY;
        switch (element.name) {
            case "rectangle":
                var rect = _this.toolbarProps.rectangle;

                _this.getCurrentFrame().add(
                    new fabric.Rect({
                        width: rect.width,
                        height: rect.height,
                        left: layerX,
                        top: layerY,
                        fill: "black"
                    })
                );

                break;

            case "triangle":
                var tri = _this.toolbarProps.triangle;

                _this.getCurrentFrame().add(
                    new fabric.Triangle({
                        width: tri.width,
                        height: tri.height,
                        fill: "black",
                        left: layerX,
                        top: layerY
                    })
                );
                break;
            case "text":
                var iTextSample = new fabric.IText('Double-click to edit', {
                    left: layerX,
                    top: layerY,
                });
                _this.getCurrentFrame().add(iTextSample);
                break;
            case "line":
                var line = new fabric.Line([layerX, layerY, layerX + 100, layerY], {
                    left: layerX,
                    top: layerY,
                    stroke: 'black'
                });
                _this.getCurrentFrame().add(line);
                break;
            case 'circle':
                var circle = new fabric.Circle({
                    radius: 20,
                    fill: '#000',
                    scaleY: 1,
                    originX: 'center',
                    originY: 'center',
                    left: layerX,
                    top: layerY
                });
                _this.getCurrentFrame().add(circle);
                break;
            case 'image':
                var input = document.createElement("input");
                input.setAttribute("type", "file");
                input.setAttribute("accept", "image/*");
                $(input).on('change', (function (event) {
                    var target = event.target ? event.target : event.currentTarget;
                    var reader = new FileReader();
                    reader.onload = function (f) {
                        var data = f.target.result;
                        fabric.Image.fromURL(data, function (img) {
                            var oImg = img.set({ left: layerX, top: layerY }).scale(0.9);
                            _this.getCurrentFrame().add(oImg).renderAll();
                        });
                    };
                    reader.readAsDataURL(target.files[0]);
                }));
                if (input.click) {
                    input.click();
                } else {
                    input.dispatchEvent(new Event('click'));
                }

                break;
            default:
                break;
        }
    };

    this.onToolbarDragStart = function (event) {
        var target = event.target ? event.target : event.currentTarget;
        if (!target) {
            return;
        }
        var controlData = {
            name: target.dataset.name
        };
        event.dataTransfer.setData("control_data", JSON.stringify(controlData));
    };
}

var canvasUtility = new CanvasUtility();

var toolbarControls = document.querySelectorAll('[data-type=toolbar]');
if (toolbarControls.length > 0) {
    toolbarControls.forEach(function (value) {
        value.addEventListener('dragstart', canvasUtility.onToolbarDragStart.bind(this))
    });
}

canvasUtility.init();