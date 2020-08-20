"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xmr_str_utils_1 = require("../../xmr-str-utils");
const SHA3 = require("keccakjs");
function cn_fast_hash(input) {
    if (input.length % 2 !== 0 || !xmr_str_utils_1.valid_hex(input)) {
        throw Error("Input invalid");
    }
    const hasher = new SHA3(256);
    hasher.update(Buffer.from(xmr_str_utils_1.hextobin(input).buffer));
    return hasher.digest("hex");
}
exports.cn_fast_hash = cn_fast_hash;
//# sourceMappingURL=index.js.map
