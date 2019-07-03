"use strict";

function LocalStorage() {
    return {

        initializeEvents: function () {
            window.addEventListener(LocalStorageKeys.SAVE_CARDS, this.saveLocalStorageData.bind(this));
        },

        saveLocalStorageData: function (event) {
            var value = typeof event.detail.value === 'object' ? JSON.stringify(event.detail.value) : event.detail.value;
            self.localStorage.setItem(event.detail.key, value);
        },

        getLocalStorageData: function (key) {
            var value = self.localStorage.getItem(key);
            return (typeof value === 'object' ? JSON.parse(value) : value);
        },

        getCards: function () {
            var cards = this.getLocalStorageData(LocalStorageKeys.GET_CARDS);
            return (!cards ? [] : JSON.parse(cards));
        },

    };
}

var localStorageObj = new LocalStorage();
window.addEventListener('save-localstorage-data', localStorageObj.saveLocalStorageData.bind(this));