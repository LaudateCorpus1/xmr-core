"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var xmr_crypto_utils_1 = require("@xmr-core/xmr-crypto-utils");
var derive_key_image_from_tx = xmr_crypto_utils_1.key_image.derive_key_image_from_tx;
var keyImagesByWalletId = {};
/**
 * @description Performs a memoized computation of a key image
 * @param {KeyImageCache} keyImageCache
 * @param {string} txPubKey
 * @param {number} outIndex
 * @param {string} address
 * @param {string} privViewKey
 * @param {string} pubSpendKey
 * @param {string} privSpendKey
 * @returns
 */
function genKeyImageFromTx(keyImageCache, txPubKey, outIndex, address, privViewKey, pubSpendKey, privSpendKey, hwdev) {
    return __awaiter(this, void 0, void 0, function () {
        var cacheIndex, cachedKeyImage, key_image;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cacheIndex = txPubKey + ":" + address + ":" + outIndex;
                    cachedKeyImage = keyImageCache[cacheIndex];
                    if (cachedKeyImage) {
                        return [2 /*return*/, cachedKeyImage];
                    }
                    return [4 /*yield*/, derive_key_image_from_tx(txPubKey, privViewKey, pubSpendKey, privSpendKey, outIndex, hwdev)];
                case 1:
                    key_image = (_a.sent()).key_image;
                    // cache the computed key image
                    keyImageCache[cacheIndex] = key_image;
                    return [2 /*return*/, key_image];
            }
        });
    });
}
exports.genKeyImageFromTx = genKeyImageFromTx;
/**
 *
 * @description Get a key image cache, that's mapped by address
 * @export
 * @param {string} address
 */
function getKeyImageCache(address) {
    var cacheId = parseAddress(address);
    var cache = keyImagesByWalletId[cacheId];
    if (!cache) {
        cache = {};
        keyImagesByWalletId[cacheId] = cache;
    }
    return cache;
}
exports.getKeyImageCache = getKeyImageCache;
/**
 * @description Clears a key image cache that's mapped by the users address
 *
 *
 * IMPORTANT: Ensure you call this method when you want to clear your wallet from
 * memory or delete it, or else you could leak key images and public addresses.
 * @export
 * @param {string} address
 */
function clearKeyImageCache(address) {
    var cacheId = parseAddress(address);
    delete keyImagesByWalletId[cacheId];
    var cache = keyImagesByWalletId[cacheId];
    if (cache) {
        throw Error("Key image cache still exists after deletion");
    }
}
exports.clearKeyImageCache = clearKeyImageCache;
/**
 * @description Normalize an address before using it to access the key image cache map as a key
 * @param {string} address
 */
function parseAddress(address) {
    // NOTE: making the assumption that public_address is unique enough to identify a wallet for caching....
    // FIXME: with subaddresses, is that still the case? would we need to split them up by subaddr anyway?
    if (!address) {
        throw Error("Address does not exist");
    }
    return address.toString();
}
//# sourceMappingURL=memoized-keyimage-generation.js.map