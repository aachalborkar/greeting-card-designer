"use strict";
function Onboard() {

    "use strict";

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
