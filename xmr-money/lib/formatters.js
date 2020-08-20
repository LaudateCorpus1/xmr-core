"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xmr_str_utils_1 = require("../../../xmr-str-utils");
const xmr_constants_1 = require("../../../xmr-constants");
function formatMoneyFull(units) {
    let strUnits = units.toString();
    const symbol = strUnits[0] === "-" ? "-" : "";
    if (symbol === "-") {
        strUnits = strUnits.slice(1);
    }
    let decimal;
    if (strUnits.length >= xmr_constants_1.config.coinUnitPlaces) {
        decimal = strUnits.substr(strUnits.length - xmr_constants_1.config.coinUnitPlaces, xmr_constants_1.config.coinUnitPlaces);
    }
    else {
        decimal = xmr_str_utils_1.padLeft(strUnits, xmr_constants_1.config.coinUnitPlaces, "0");
    }
    return (symbol +
        (strUnits.substr(0, strUnits.length - xmr_constants_1.config.coinUnitPlaces) || "0") +
        "." +
        decimal);
}
exports.formatMoneyFull = formatMoneyFull;
function formatMoneyFullWithSymbol(units) {
    return formatMoneyFull(units) + " " + xmr_constants_1.config.coinSymbol;
}
exports.formatMoneyFullWithSymbol = formatMoneyFullWithSymbol;
function formatMoney(units) {
    const f = xmr_str_utils_1.trimRight(formatMoneyFull(units), "0");
    if (f[f.length - 1] === ".") {
        return f.slice(0, f.length - 1);
    }
    return f;
}
exports.formatMoney = formatMoney;
function formatMoneyWithSymbol(units) {
    return formatMoney(units) + " " + xmr_constants_1.config.coinSymbol;
}
exports.formatMoneyWithSymbol = formatMoneyWithSymbol;
function printDsts(dsts) {
    for (let i = 0; i < dsts.length; i++) {
        console.log(dsts[i].address + ": " + formatMoneyFull(dsts[i].amount));
    }
}
exports.printDsts = printDsts;
//# sourceMappingURL=formatters.js.map
