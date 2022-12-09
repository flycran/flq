"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.awaitTime = void 0;
var awaitTime = function (time, text) { return new Promise(function (resolve) {
    setTimeout(function () {
        console.log(text);
        resolve(null);
    }, time);
}); };
exports.awaitTime = awaitTime;
