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
        $(document).on('ADD_NEW_CARD', this.addNewCard.bind(this));
        $(document).on('GET_CARDS', this.getCards.bind(this));
    },


    getCards: function (event) {
        event.detail.callback(this.model.getCards());
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

    onFrameSelectionChange: function () {
        var value = event.target.value;
        if (!value) {
            return this.view.hideFrameImagePreview();
        }
        return this.view.showFrameImagePreview(value);
    },

}