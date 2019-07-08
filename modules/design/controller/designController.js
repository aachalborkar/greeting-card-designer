var DesignController = (function () {

    var utilsObj = new Utils();


    function DesignController(designModal, designView) {
        this.model = designModal;
        this.view = designView;
        this.init();
    }

    DesignController.prototype = {

        init: function () {
            this.view.$window.addEventListener('load', this.initializeDesign.bind(this));
            this.applyToolbarEvents();
        },

        applyToolbarEvents: function () {
            if (this.view.$toolbarControls.length > 0) {
                this.view.$toolbarControls.forEach(function (value) {
                    value.addEventListener('dragstart', this.onToolbarDragStart.bind(this))
                }.bind(this));
            }
        },

        isValidDimention: function (stringDimention) {
            return /(?:[\d]+)x(?:[\d]+)/gm.test(stringDimention);
        },

        initializeDesign: function (event) {
            var searchObject = utilsObj.searchToObject();
            var designMode = searchObject.card_name && searchObject.dimention && this.isValidDimention(searchObject.dimention);
            if (designMode) {
                this.view.initializeDesign(searchObject);
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

    };

    return DesignController;
})();
