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
        $(document).on('ADD_NEW_CARD', this.addNewCard.bind(this));
        // this.view.$createCardForm.addEventListener('submit', this.view.addNewCard.bind({ controller: this, callback: this.addNewCard }));
        // this.view.$frameListElement.addEventListener('change', this.onFrameSelectionChange.bind(this));
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
        var cardObject = this.createCardObject(event.detail.card_data);
        cardObject['created_at'] = (new Date()).toDateString();
        this.model.saveCard(cardObject);
        document.dispatchEvent(new CustomEvent('ON_NEW_CARD_ADDED', { detail: cardObject }));
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
    },

}