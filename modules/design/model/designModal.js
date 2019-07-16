var DesignModal = (function () {

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

    function DesignModal() {

    }

    DesignModal.prototype = {
        getToolbarProperties: function () {
            return toolbarProps;
        }
    }

    return DesignModal;
}());

