"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const biginteger_1 = require("xmr-core/biginteger");
function encode_varint(input) {
    let i = new biginteger_1.BigInt(input);
    let out = "";
    // While i >= b10000000
    while (i.compare(0x80) >= 0) {
        // out.append i & b01111111 | b10000000
        out += ("0" + ((i.lowVal() & 0x7f) | 0x80).toString(16)).slice(-2);
        i = i.divide(new biginteger_1.BigInt(2).pow(7));
    }
    out += ("0" + i.toJSValue().toString(16)).slice(-2);
    return out;
}
exports.encode_varint = encode_varint;
//# sourceMappingURL=index.js.map
