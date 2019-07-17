function loadDesignModule(event) {
    switch (event.detail.name) {
        case 'DESIGN_MODULE':
            var scripts = [
                './modules/core/utils.js',
                './modules/design/view/designView.js',
                './modules/design/controller/designController.js',
                './modules/design/model/designModal.js',
                './modules/design/design.module.js'
            ];


            scripts.forEach(function (scriptPath) {
                var script = document.createElement('script');
                script.type = "text/javascript";
                script.src = scriptPath;
                script.async = false;
                document.body.appendChild(script);
            });

            setTimeout(function () {
                event.detail.callback(event);
            }, 20);

    }
}

document.addEventListener('LOAD_MODULE', this.loadDesignModule.bind(this));