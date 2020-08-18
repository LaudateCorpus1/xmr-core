"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.V7_MIN_MIXIN = 6;
function _mixinToRingsize(mixin) {
    return mixin + 1;
}
function minMixin() {
    return exports.V7_MIN_MIXIN;
}
exports.minMixin = minMixin;
function minRingSize() {
    return _mixinToRingsize(minMixin());
}
exports.minRingSize = minRingSize;
function fixedMixin() {
    return minMixin(); /* using the monero app default to remove MM user identifiers */
}
exports.fixedMixin = fixedMixin;
function fixedRingsize() {
    return _mixinToRingsize(fixedMixin());
}
exports.fixedRingsize = fixedRingsize;
//# sourceMappingURL=mixin_utils.js.map