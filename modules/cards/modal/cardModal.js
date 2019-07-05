var CardModal = (function () {

    // Define private variables here (eg. var <variable_name> = <value>)
    var cards = [];

    function CardModal() {
    }

    CardModal.prototype = {

        getCards: function () {
            var cardList = self.localStorage.getItem(LocalStorageKeys.CARD_LIST);
            return cardList ? JSON.parse(cardList) : [];
        },

        saveCard: function (cardData) {
            cards = this.getCards()
            cards.push(cardData);
            self.localStorage.setItem(LocalStorageKeys.CARD_LIST, JSON.stringify(cards));
            return true;
        }

    }

    return CardModal;
}());
