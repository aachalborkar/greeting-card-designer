"use strict";
function Onboard() {

    "use strict";
    var jqTemplateOptions = {
        inplace: true,
        root: '#iframeListContainer'
    };

    /**
     * Initialize Onboarding page
     */
    this.initialize = function () {
        this.showFrameContainer();
        this.renderFrameList();
    }

    /**
     * Render Frame List
     */
    this.renderFrameList = function () {
        var _this = this;
        var jqFrameModal = {
            list: AppData.FrameList,
            onFrameSelect: function (event) {
                _this.initializeDesign();
                canvasUtility.init(event.width, event.height);
            },
            onHover: function () {
                $(this).css("background-color", "rgba(213, 225, 239, 0.25)");
                $(this).css("cursor", "pointer");
            },
            onLeave: function () {
                $(this).css("background-color", "white");
                $(this).css("cursor", "default");
            },
        }

        $().ready(function () {
            $("#frameContainer").jqtemplate(jqFrameModal, jqTemplateOptions);
        });
    }

    this.initializeDesign = function () {
        this.hideFrameContainer();
        this.enableDesignMode();
    }

    this.enableDesignMode = function () {
        document.getElementById('designContainer').classList.remove('d-none');
    }

    this.showFrameContainer = function () {
        document.getElementById('frameContainer').classList.remove('d-none');
    }

    this.hideFrameContainer = function () {
        document.getElementById('frameContainer').classList.add('d-none');
    }
}
