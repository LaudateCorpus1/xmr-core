"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xmr_constants_1 = require("xmr-core/xmr-constants");
const biginteger_1 = require("xmr-core/biginteger");
/**
 *
 * @param {string} str
 */
function parseMoney(str) {
    if (!str)
        return biginteger_1.BigInt.ZERO;
    const negative = str[0] === "-";
    if (negative) {
        str = str.slice(1);
    }
    const decimalIndex = str.indexOf(".");
    if (decimalIndex == -1) {
        if (negative) {
            return xmr_constants_1.config.coinUnits.multiply(str).negate();
        }
        return xmr_constants_1.config.coinUnits.multiply(str);
    }
    if (decimalIndex + xmr_constants_1.config.coinUnitPlaces + 1 < str.length) {
        str = str.substr(0, decimalIndex + xmr_constants_1.config.coinUnitPlaces + 1);
    }
    if (negative) {
        return new biginteger_1.BigInt(str.substr(0, decimalIndex))
            .exp10(xmr_constants_1.config.coinUnitPlaces)
            .add(new biginteger_1.BigInt(str.substr(decimalIndex + 1)).exp10(decimalIndex + xmr_constants_1.config.coinUnitPlaces - str.length + 1))
            .negate();
    }
    return new biginteger_1.BigInt(str.substr(0, decimalIndex))
        .exp10(xmr_constants_1.config.coinUnitPlaces)
        .add(new biginteger_1.BigInt(str.substr(decimalIndex + 1)).exp10(decimalIndex + xmr_constants_1.config.coinUnitPlaces - str.length + 1));
}
exports.parseMoney = parseMoney;
function decompose_tx_destinations(dsts, rct) {
    const out = [];
    if (rct) {
        for (let i = 0; i < dsts.length; i++) {
            out.push({
                address: dsts[i].address,
                amount: dsts[i].amount,
            });
        }
    }
    else {
        for (let i = 0; i < dsts.length; i++) {
            const digits = decompose_amount_into_digits(dsts[i].amount);
            for (let j = 0; j < digits.length; j++) {
                if (digits[j].compare(0) > 0) {
                    out.push({
                        address: dsts[i].address,
                        amount: digits[j],
                    });
                }
            }
        }
    }
    return out.sort((a, b) => a.amount.subtract(b.amount).toJSValue());
}
exports.decompose_tx_destinations = decompose_tx_destinations;
function decompose_amount_into_digits(amount) {
    let amtStr = amount.toString();
    const ret = [];
    while (amtStr.length > 0) {
        //check so we don't create 0s
        if (amtStr[0] !== "0") {
            let digit = amtStr[0];
            while (digit.length < amtStr.length) {
                digit += "0";
            }
            ret.push(new biginteger_1.BigInt(digit));
        }
        amtStr = amtStr.slice(1);
    }
    return ret;
}
//# sourceMappingURL=parsers.js.map
