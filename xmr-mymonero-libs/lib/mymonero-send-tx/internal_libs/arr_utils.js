"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function popRandElement(list) {
    var idx = Math.floor(Math.random() * list.length);
    var val = list[idx];
    list.splice(idx, 1);
    return val;
}
exports.popRandElement = popRandElement;
//# sourceMappingURL=arr_utils.js.map