"use strict";
// tiny small medium big
Object.defineProperty(exports, "__esModule", { value: true });
function defineTable(modelRecord) {
    return new Table(modelRecord);
}
var Table = /** @class */ (function () {
    function Table(modelRecord) {
        this.modelRecord = modelRecord;
    }
    Table.prototype.field = function (field) {
        return 0;
    };
    Table.prototype.fields = function () {
        var field = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            field[_i] = arguments[_i];
        }
        return 0;
    };
    Table.prototype.find = function () {
        return 0;
    };
    Table.prototype.first = function () {
        return 0;
    };
    return Table;
}());
function fiedl(m) {
    return m;
}
var user = new Table({
    id: {
        type: 'int',
    },
    shopId: {
        type: 'int',
    },
});
var shop = new Table({
    id: {
        type: 'int',
    },
    name: {
        type: 'int',
    },
});
