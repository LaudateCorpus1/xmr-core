"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("./errors");
var open_alias_lite_1 = require("./open_alias_lite");
var xmr_crypto_utils_1 = require("xmr-core/xmr-crypto-utils");
var xmr_money_1 = require("xmr-core/xmr-money");
/**
 * @description Map through the provided targets and normalize each address/amount pair
 *
 * Addresses are checked to see if they may belong to an OpenAlias address, and rejected if so.
 * Then they are validated by attempting to decode them.
 *
 * Amounts are attempted to be parsed from string value to BigInt value
 *
 * The validated address / parsed amount pairs are then returned
 *
 * @export
 * @param {RawTarget[]} targetsToParse
 * @param {NetType} nettype
 * @returns {ParsedTarget[]}
 */
function parseTargets(targetsToParse, nettype) {
    return targetsToParse.map(function (_a) {
        var address = _a.address, amount = _a.amount;
        if (!address && !amount) {
            throw errors_1.ERR.PARSE_TRGT.EMPTY;
        }
        if (open_alias_lite_1.possibleOAAddress(address)) {
            throw errors_1.ERR.PARSE_TRGT.OA_RES;
        }
        var amountStr = amount.toString();
        try {
            xmr_crypto_utils_1.decode_address(address, nettype);
        }
        catch (e) {
            throw errors_1.ERR.PARSE_TRGT.decodeAddress(address, e);
        }
        try {
            var parsedAmount = xmr_money_1.parseMoney(amountStr);
            return { address: address, amount: parsedAmount };
        }
        catch (e) {
            throw errors_1.ERR.PARSE_TRGT.amount(amountStr, e);
        }
    });
}
exports.parseTargets = parseTargets;
//# sourceMappingURL=parse_target.js.map
