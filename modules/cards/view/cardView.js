var CardView = function () {
    this.init();
}

CardView.prototype = {

    init: function () {
        this.getViewElementsWithEvents();
    },

    getViewElementsWithEvents: function () {
        this.$window = window;
        this.$frameListElement = document.querySelector('[data-name=frameList]');
        document.addEventListener('ON_NEW_CARD_ADDED', this.onNewCardAdded.bind(this));
        return this;
    },

    onFrameSelectionChange: function () {
        var value = event.target.value;
        if (!value) {
            return this.hideFrameImagePreview();
        }
        return this.showFrameImagePreview(value);
    },

    loadNewCardPopup: function (event) {
        var newCardScriptContent = $('[data-key=new_card_script]').text().trim();

        if (!newCardScriptContent) {
            $('[data-key=new_card_script]').load('./modules/cards/view/new_card.html', function (response, status, xhr) {

                this.renderView('newCardPopup', document.querySelector('[data-key=new_card_script]').innerHTML, {}, '[data-key=new_card]');
                this.$createCardForm = document.querySelector('[data-name=frmCreateCard]');

                $('[data-name=popup_new_card]').modal({ show: true });

                document.querySelector('[data-name=frameList]').addEventListener('change', this.onFrameSelectionChange.bind(this));
                document.querySelector('[data-name=frmCreateCard]').addEventListener('submit', this.addNewCard.bind(this));

            }.bind(this));
        } else {
            $('[data-name=popup_new_card]').modal('show');
            console.log('else');
        }
    },

    show: function (htmlElement) {
        htmlElement.classList.remove('d-none');
    },

    hide: function (htmlElement) {
        htmlElement.classList.add('d-none');
    },

    showFrameImagePreview: function (value) {
        var previewImg = document.querySelector('[data-name=frame-preview-img]');

        if (previewImg) {
            previewImg.setAttribute('src', 'https://dummyimage.com/' + value + '/f2f4f5/525252');
            document.querySelector('[data-name=frame-preview-block]').classList.remove('d-none');
        }
    },

    hideFrameImagePreview: function () {
        document.querySelector('[data-name=frame-preview-block]').classList.add('d-none');
    },

    onNewCardAdded: function (event) {
        $('[data-name=popup_new_card]').modal('hide');
        this.initializeDesign(event.detail);
    },

    initializeDesign: function (detail) {
        document.dispatchEvent(new CustomEvent('INIT_DESIGN', { detail: detail }));
    },

    addNewCard: function (event) {
        var formData = $(event.target).serializeArray();
        var eve = new CustomEvent('ADD_NEW_CARD', {
            detail: { card_data: formData }
        });
        document.dispatchEvent(eve);
        event.preventDefault();
    },

    // triggerA

    displayGetStartedBlock: function () {
        $('[data-key="content_script"]').load('./modules/cards/view/content.html', function (response, status, xhr) {
            this.renderView('cardIndexContent', document.querySelector('[data-key="content_script"]').innerText, {}, document.querySelector('[data-key=content]'));
            var getStartedBlock = document.querySelector('[data-name=get_started_block]');
            if (getStartedBlock instanceof HTMLElement) {
                getStartedBlock.classList.remove('d-none');
                document.querySelector('[data-name=get_started]').addEventListener('click', this.loadNewCardPopup.bind(this));
            }
        }.bind(this));
    },

    renderCardData: function (data) {
        this.updateCardCounter(data);
        this.loadHeader();
        if (data.length > 0) {
            return this.showCardList(data);
        }
        this.displayGetStartedBlock();
    },


    loadAndRenderViews: function (response, status, xhr) {
        var _this = this._this;
        var _data = this._data;

        if (status === 'error') {
            var msg = "Sorry but there was an error: ";
            alert(msg + xhr.status + " " + xhr.statusText);
        }

        _this.renderView('cardIndexContent', document.querySelector('[data-key="content_script"]').innerText, {}, document.querySelector('[data-key=content]'));
        _this.show(document.querySelector('[data-name=card-list]'));
        _this.renderView('cardListTemplate', document.querySelector('[data-card-list-view]').innerText, _data, '[data-name=card-items]');
        document.querySelector('[data-name="edit_card"]').addEventListener('click', function (event) {
            var cardObject = {
                card_name: $(event.target).data('card-name'),
                dimension: $(event.target).data('dimension')
            }
            this.initializeDesign(cardObject);
        }.bind(_this));
    },

    initializeHeader: function (response, status, xhr) {
        var headerHtml = document.querySelector('[data-key=header_script]');
        this.renderView('cardHeader', headerHtml.innerText, {}, '[data-key=header]');
        document.querySelector('[data-name=new_card_btn]').addEventListener('click', this.loadNewCardPopup.bind(this));
    },

    loadHeader: function () {
        $('[data-key=header_script]').load('./modules/cards/view/header.html', this.initializeHeader.bind(this));
    },

    showCardList: function (data) {
        $('[data-key="content_script"]').load('./modules/cards/view/content.html', this.loadAndRenderViews.bind({ _this: this, _data: data }));
    },

    updateCardCounter: function (cardList) {
        $('[data-key="header_info_script"]').load('./modules/cards/view/header_info.html', function (response, status, xhr) {
            this.renderView('cardCount', document.querySelector('[data-key=header_info_script]').innerText, { card_count: cardList.length }, '[data-key=card_count]');
        }.bind(this));
    },

    renderView: function (templateName, htmlString, data, appendToElementSelector) {
        $.template(templateName, htmlString.trim());
        $.tmpl(templateName, data).appendTo(appendToElementSelector);
    }
}