var CardController = function (cardModel, cardView) {
    this.model = cardModel;
    this.view = cardView;
    this.init();
}

CardController.prototype = {

    init: function () {
        this.bindEventHandlers();
    },

    bindEventHandlers: function () {
        this.view.$window.addEventListener('load', this.listCards.bind(this));
        this.view.$createCardForm.addEventListener('submit', this.addNewCard.bind(this));
        this.view.$frameListElement.addEventListener('change', this.onFrameSelectionChange.bind(this));
        return this;
    },

    createCardObject: function (cardDataArray) {
        var cardObject = {};
        for (var index = 0; index < cardDataArray.length; index++) {
            cardObject[cardDataArray[index].name] = cardDataArray[index].value;
        }
        return cardObject;
    },


    addNewCard: function (event) {
        var formData = $(event.target).serializeArray();

        var cardObject = this.createCardObject(formData);

        cardObject['created_at'] = (new Date()).toDateString();

        this.model.saveCard(cardObject);
        this.view.designCard();
        event.preventDefault();
    },

    listCards: function (event) {
        this.view.renderCardData(this.model.getCards());
    },

    onFrameSelectionChange: function () {
        var value = event.target.value;
        if (!value) {
            return this.view.hideFrameImagePreview();
        }
        return this.view.showFrameImagePreview(value);

        var previewImg = document.querySelector('[data-name=frame-preview-img]');

        if (previewImg) {
            previewImg.setAttribute('src', 'https://dummyimage.com/' + value + '/f2f4f5/525252');
            previewBlock.classList.remove('d-none');
        }
    },

}