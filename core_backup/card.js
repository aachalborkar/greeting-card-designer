"use strict";
function Card() {

    var _localStorage_card = new LocalStorage();
    var utilsObj = new Utils();

    return {
        isValidDimention: function (stringDimention) {
            return /(?:[\d]+)x(?:[\d]+)/gm.test(stringDimention);
        },

        isDesignerMode: function () {
            var searchObject = utilsObj.searchToObject();
            return searchObject.card_name && searchObject.dimention && this.isValidDimention(searchObject.dimention);
        },

        createCard: function (event) {
            var cardObject = this.createCardObject(event.detail);
            var queryString = $.param(cardObject);
            cardObject['created_at'] = (new Date()).toDateString();
            var cards = _localStorage_card.getCards();
            cards.push(cardObject);
            window.dispatchEvent(new CustomEvent('save-localstorage-data', { detail: { key: LocalStorageKeys.GET_CARDS, value: cards } }));
            window.location.href = "design.html?" + queryString;
        },

        createCardObject: function (cardDataArray) {
            var cardObject = {};
            for (var index = 0; index < cardDataArray.length; index++) {
                cardObject[cardDataArray[index].name] = cardDataArray[index].value;
            }
            return cardObject;
        }
    };
}
var card = new Card();
var designMode = card.isDesignerMode();

if (!designMode && window.location.pathname.indexOf('design') > 0) {
    window.location.href = "index.html";
}

if (designMode) {
    document.getElementById('designContainer').classList.remove('d-none');
}
window.addEventListener('create-card', card.createCard.bind(card));