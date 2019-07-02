function Onboard() {

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
        var jqFrameModal = {
            list: AppData.FrameList,
        }

        $().ready(function () {
            $("#frameContainer").jqtemplate(jqFrameModal, jqTemplateOptions);
        });
    }

    this.showFrameContainer = function () {
        document.getElementById('frameContainer').classList.remove('d-none');
    }

    this.hideFrameContainer = function () {
        document.getElementById('frameContainer').classList.add('d-none');
    }
}
