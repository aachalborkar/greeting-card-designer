var DesignView = (function () {

    var currentFrameObject = null;

    var isHeaderLoaded = false;
    var isEditorLoaded = false;

    function DesignView(designModal) {
        this.designModal = designModal;
        this.init();
    }

    DesignView.prototype = {

        init: function () {
            this.getViewElementsWithEvents();
        },

        getViewElementsWithEvents: function () {
            this.$window = window;
            document.addEventListener('INIT_DESIGN', this.initializeDesign.bind(this));
        },

        initializeDesign: function (event) {

            document.querySelector('[data-key="card_count"]').innerHTML = '';

            this.loadStyles();

            if (!isHeaderLoaded) {
                $('[data-key=header_script]').load('./modules/design/view/header.html', this.initHeader.bind(this));
            }

            if (!isEditorLoaded) {
                $('[data-key="content_script"]').load('./modules/design/view/content.html', this.initEditor.bind({ _this: this, event: event }));
            }
        },

        applyToolbarEvents: function () {
            if (this.$toolbarControls.length > 0) {
                this.$toolbarControls.forEach(function (value) {
                    value.addEventListener('dragstart', this.onToolbarDragStart.bind(this))
                }.bind(this));
            }
        },


        onToolbarDragStart: function (event) {
            var target = event.target ? event.target : event.currentTarget;
            if (!target) {
                return;
            }
            var controlData = {
                name: target.dataset.name
            };
            event.dataTransfer.setData("control_data", JSON.stringify(controlData));
        },

        loadStyles: function (event) {
            $("<link/>", {
                rel: "stylesheet",
                type: "text/css",
                href: "./styles/canvas.css"
            }).appendTo("head");
        },

        initEditor: function (response, status, xhr) {
            var contentHtml = document.querySelector('[data-key=content_script]');
            document.querySelector('[data-key=content]').innerHTML = '';
            this._this.renderView('designContent', contentHtml.innerText, {}, '[data-key=content]');
            document.getElementById('designContainer').classList.remove('d-none');
            var matches = /([\d]+)x([\d]+)/gm.exec(this.event.detail.dimension);
            this._this.drawFrame(matches[1], matches[2]);

            this._this.$toolbarControls = document.querySelectorAll('[data-type=toolbar]');
            this._this.applyToolbarEvents();
        },

        initHeader: function (response, status, xhr) {
            var headerHtml = document.querySelector('[data-key=header_script]');
            if (!isHeaderLoaded || !headerHtml.innerHTML.trim()) {
                isHeaderLoaded = true;
                this.renderView('designHeader', headerHtml.innerText, {}, '[data-key=header]');
            }
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
            var rect = this.designModal.getToolbarProperties().rectangle;
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
            var tri = this.designModal.getToolbarProperties().triangle;
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


        addImageToFrame: function (fileReaderEvent) {
            var data = fileReaderEvent.target.result;
            fabric.Image.fromURL(data, function (img) {
                var oImg = img.set({ left: this.left, top: this.top }).scale(0.9);
                this._this.getCurrentFrame().add(oImg).renderAll();
            }.bind(this));
        },

        onFileSelected: function (event) {
            var target = event.target ? event.target : event.currentTarget;
            var reader = new FileReader();
            reader.onload = this._this.addImageToFrame.bind({ _this: this._this, left: this.left, top: this.top });
            reader.readAsDataURL(target.files[0]);
        },

        drawImage: function (left, top) {
            var input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            $(input).on('change', this.onFileSelected.bind({ _this: this, left: left, top: top }));
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
        },

        renderView: function (templateName, htmlString, data, appendToElementSelector) {
            $.template(templateName, htmlString.trim());
            $.tmpl(templateName, data).appendTo(appendToElementSelector);
        }
    }

    return DesignView;
})();