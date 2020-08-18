"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("./logger");
var xmr_crypto_utils_1 = require("@xmr-core/xmr-crypto-utils");
function getTargetPubViewKey(encPid, targetAddress, nettype) {
    if (encPid) {
        var key = xmr_crypto_utils_1.decode_address(targetAddress, nettype).view;
        logger_1.Log.Target.viewKey(key);
        return key;
    }
}
exports.getTargetPubViewKey = getTargetPubViewKey;
//# sourceMappingURL=key_utils.js.map