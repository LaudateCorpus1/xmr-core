"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const biginteger_1 = require("@xmr-core/biginteger");
const hex_strings_1 = require("./hex-strings");
//switch byte order charwise
function swapEndianC(str) {
    let data = "";
    for (let i = 1; i <= str.length; i++) {
        data += str.substr(0 - i, 1);
    }
    return data;
}
exports.swapEndianC = swapEndianC;
//for most uses you'll also want to swapEndian after conversion
//mainly to convert integer "scalars" to usable hexadecimal strings
//uint long long to 32 byte key
function d2h(integer) {
    let padding = "";
    for (let i = 0; i < 63; i++) {
        padding += "0";
    }
    return (padding + new biginteger_1.BigInt(integer).toString(16).toLowerCase()).slice(-64);
}
exports.d2h = d2h;
//integer (string) to scalar
function d2s(integer) {
    return hex_strings_1.swapEndian(d2h(integer));
}
exports.d2s = d2s;
//convert integer string to 64bit "binary" little-endian string
function d2b(integer) {
    let padding = "";
    for (let i = 0; i < 63; i++) {
        padding += "0";
    }
    const a = new biginteger_1.BigInt(integer);
    if (a.toString(2).length > 64) {
        throw Error("amount overflows uint64!");
    }
    return swapEndianC((padding + a.toString(2)).slice(-64));
}
exports.d2b = d2b;
//# sourceMappingURL=integer-strings.js.map