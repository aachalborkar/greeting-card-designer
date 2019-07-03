"use strict";
function Application() {

    var _localStorage_app = new LocalStorage();

    return {

        start: function () {
            this.initialize();
        },

        initialize: function () {
            this.displayCards();
        },

        createCard: function (event) {
            var formData = $(event.target).serializeArray();
            window.dispatchEvent(new CustomEvent('create-card', { detail: formData }));
            event.preventDefault();
        },

        onFrameSelectionChange: function () {
            var value = event.target.value;
            var previewBlock = document.querySelector('[data-name=frame-preview-block]');

            if (!value) {
                if (previewBlock) {
                    previewBlock.classList.add('d-none');
                }
                return;
            }

            var previewImg = document.querySelector('[data-name=frame-preview-img]');

            if (previewImg) {
                previewImg.setAttribute('src', 'https://dummyimage.com/' + value + '/f2f4f5/525252');
                previewBlock.classList.remove('d-none');
            }
        },

        initCardEvents: function () {
            document.querySelector('[data-name=frmCreateCard]').addEventListener('submit', this.createCard.bind(this));
            document.querySelector('[data-name=frameList]').addEventListener('change', this.onFrameSelectionChange.bind(this));
        },

        displayCards: function () {
            var cards = _localStorage_app.getCards();

            this.initCardEvents();

            if (cards.length === 0) {
                this.displayGetStartedBlock();
                return;
            }

            document.querySelector('[data-name=get_started_block]').classList.add('d-none');

            var cardBadge = document.querySelector('[data-card-count]');
            if (cardBadge instanceof HTMLElement) {
                cardBadge.innerHTML = cards.length;
                document.querySelector('[data-name=card-list]').classList.remove('d-none');
                var markup = '<div class="col-3">\
                <div class="card mb-4 shadow-sm">\
                  <div class="card-header">\
                    <h4 class="my-0 font-weight-normal">${card_name}</h4>\
                  </div>\
                  <div class="card-body">\
                    <h1 class="card-title pricing-card-title"><small class="text-muted">${dimention}</small></h1>\
                    <ul class="list-unstyled mt-3 mb-4">\
                      <li>Created at: <h6>${created_at}</h6>\
                      </li>\
                    </ul>\
                    <a href="design.html?card_name=${card_name}&dimention=${dimention}" class="btn btn-lg btn-block btn-primary">Edit</a>\
                  </div>\
                </div>\
              </div>';

                $.template('cardListTemplate', markup);
                $.tmpl('cardListTemplate', cards).appendTo('[data-name=card-items]');
            }

        },

        displayGetStartedBlock: function () {
            var getStartedBlock = document.querySelector('[data-name=get_started_block]');
            if (getStartedBlock instanceof HTMLElement) {
                getStartedBlock.classList.remove('d-none');
                // document.querySelector('[data-name=btn-create-card]').addEventListener('click', ());
            }
        },

        hideGetStartedContainer: function () {
            document.getElementById('getStartedContainer').classList.add('d-none');
        },

        showGetStartedContainer: function () {
            document.getElementById('getStartedContainer').classList.remove('d-none');
        }
    };
}