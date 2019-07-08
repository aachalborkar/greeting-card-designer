var DesignView = (function () {

    var currentFrameObject = null;
    var toolbarProps = {
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


    function DesignView() {
        this.init();
    }

    DesignView.prototype = {

        init: function () {
            this.getViewElementsWithEvents();
        },

        getViewElementsWithEvents: function () {
            this.$window = window;
            this.$toolbarControls = document.querySelectorAll('[data-type=toolbar]');
        },

        initializeDesign: function (searchObject) {
            document.getElementById('designContainer').classList.remove('d-none');

            var matches = /([\d]+)x([\d]+)/gm.exec(searchObject.dimention);
            this.drawFrame(matches[1], matches[2]);
        },

        drawFrame: function (width, height) {
            var canvasElement = document.getElementById("greetingCanvas");
            canvasElement.width = width ? width : 500;
            canvasElement.height = height ? height : 600;
            canvasElement.style.border = "1px solid lightgrey";
            currentFrameObject = new fabric.Canvas("greetingCanvas");
            this.bindFrameEvents();
        },

        // Fabric object doesn't trigger drop events in normal way. You have to use "on" method to implement it.
        // https://stackoverflow.com/questions/49931874/cannot-catch-drag-events-in-fabricjs
        bindFrameEvents: function () {
            if (currentFrameObject) {
                currentFrameObject.on(
                    "dragover",
                    function (event) {
                        return event.e.preventDefault();
                    },
                    false
                );
                currentFrameObject.on("drop", this.onFrameDrop.bind(this), false);
            }
        },

        getCurrentFrame: function () {
            return currentFrameObject;
        },

        drawRectangle: function (left, top) {
            var rect = toolbarProps.rectangle;
            this.getCurrentFrame().add(
                new fabric.Rect({
                    width: rect.width,
                    height: rect.height,
                    left: left,
                    top: top,
                    fill: "black"
                })
            );
        },

        drawTriangle: function (left, top) {
            var tri = toolbarProps.triangle;

            this.getCurrentFrame().add(
                new fabric.Triangle({
                    width: tri.width,
                    height: tri.height,
                    fill: "black",
                    left: left,
                    top: top
                })
            );
        },

        drawText: function (left, top) {
            var iTextSample = new fabric.IText('Double-click to edit', {
                left: left,
                top: top,
            });
            this.getCurrentFrame().add(iTextSample);
        },

        drawLine: function (left, top) {
            var line = new fabric.Line([left, top, left + 100, top], {
                left: left,
                top: top,
                stroke: 'black'
            });
            this.getCurrentFrame().add(line);
        },

        drawCircle: function (left, top) {
            var circle = new fabric.Circle({
                radius: 20,
                fill: '#000',
                scaleY: 1,
                originX: 'center',
                originY: 'center',
                left: left,
                top: top
            });
            this.getCurrentFrame().add(circle);
        },

        drawImage: function (left, top) {
            var input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            $(input).on('change', (function (event) {
                var target = event.target ? event.target : event.currentTarget;
                var reader = new FileReader();
                reader.onload = function (f) {
                    var data = f.target.result;
                    fabric.Image.fromURL(data, function (img) {
                        var oImg = img.set({ left: left, top: top }).scale(0.9);
                        this.getCurrentFrame().add(oImg).renderAll();
                    }.bind(this));
                }.bind(this);
                reader.readAsDataURL(target.files[0]);
            }).bind(this));
            if (input.click) {
                input.click();
            } else {
                input.dispatchEvent(new Event('click'));
            }
        },

        onFrameDrop: function (event) {
            var element = event.e.dataTransfer.getData("control_data");

            element = element ? JSON.parse(element) : {};

            if (!element.name) {
                throw new Error("Invalid property received.!!");
            }

            var layerX = event.e.layerX,
                layerY = event.e.layerY;
            switch (element.name) {

                case "rectangle":
                    return this.drawRectangle(layerX, layerY);

                case "triangle":
                    return this.drawTriangle(layerX, layerY);

                case "text":
                    return this.drawText(layerX, layerY);

                case "line":
                    return this.drawLine(layerX, layerY);

                case 'circle':
                    return this.drawCircle(layerX, layerY);

                case 'image':
                    return this.drawImage(layerX, layerY);

                default:
                    break;
            }
        }
    }

    return DesignView;
})();