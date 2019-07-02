function Onboard() {
    this.initialize = function () {
        this.showFrameContainer();
    }

    this.renderFrameList = function () {
        $("#frameContainer .frameContainer").jqtemplate({
            list: ["So", "Freakin", "AWESOME!"]
        });
    }

    this.showFrameContainer = function () {
        document.getElementById('frameContainer').classList.remove('d-none');
    }

    this.hideFrameContainer = function () {
        document.getElementById('frameContainer').classList.add('d-none');
    }
}
