"use strict";

function ConstantUtil() {
    return {
        DEFAULT_CONFIG: {
            writable: false,
            configurable: false
        },

        setWritable: function (state) { // true or false
            this.DEFAULT_CONFIG.writable = state;
            return this;
        },

        setConfigurable: function (state) {
            this.DEFAULT_CONFIG.configurable = state;
            return this;
        },

        createConstant: function (object, property, constantValue) {
            if (typeof property === 'string') {
                var attributes = {
                    value: constantValue,
                    writable: this.DEFAULT_CONFIG.writable,
                    configurable: this.DEFAULT_CONFIG.configurable
                };
                Object.defineProperty(object, property, attributes);
            }

            return this;
        }
    };
}

var AppData = {};
var constantUtil = new ConstantUtil();

// Create FrameList Constant
constantUtil.createConstant(AppData, 'FrameList', [
    { name: '500x600', width: '500', height: '600' },
    { name: '600x300', width: '600', height: '300' },
    { name: '200x400', width: '200', height: '400' },
    { name: '800x300', width: '800', height: '300' }
]);

// Create localstorage key constants
var LocalStorageKeys = {};
constantUtil
    // .createConstant(LocalStorageKeys, 'SAVE_FRAMES', 'localstorage_SAVE_FRAMES')
    .createConstant(LocalStorageKeys, 'GET_FRAMES', 'frameList')
    .createConstant(LocalStorageKeys, 'GET_CARDS', 'cardsList');
    // .createConstant(LocalStorageKeys, 'SAVE_CARDS', 'localstorage_SAVE_CARDS');
