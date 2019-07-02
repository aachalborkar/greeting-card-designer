"use strict";

function Application() {

    var _app = this;
    this.onBoardObj = new Onboard();

    this.start = function () {
        this.initialize();
    }

    this.initialize = function () {
        document.getElementById('btnGetStarted').addEventListener('click', function (event) {
            _app.hideGetStartedContainer();
            _app.onBoardObj.initialize(event);
        });
    }

    this.hideGetStartedContainer = function () {
        document.getElementById('getStartedContainer').classList.add('d-none');
    }

    this.showGetStartedContainer = function () {
        document.getElementById('getStartedContainer').classList.remove('d-none');
    }
}