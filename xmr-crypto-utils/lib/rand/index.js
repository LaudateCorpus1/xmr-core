"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const primitive_ops_1 = require("../crypto-ops/primitive_ops");
// Generate a 256-bit / 64-char / 32-byte crypto random
async function rand_32() {
    const res = (await crypto_1.randomBytes(132))
    const res2 = Buffer.from(res).toString("hex").substr(0, 64)
    return res2
}
exports.rand_32 = rand_32;
// Generate a 64-bit / 16-char / 8-byte crypto random
async function rand_8() {
    const res = (await crypto_1.randomBytes(18))
    const res2 = Buffer.from(res).toString("hex").substr(0, 16)
    return res2
}
exports.rand_8 = rand_8;
// Random 32-byte ec scalar
async function random_scalar() {
    return primitive_ops_1.sc_reduce32(await rand_32());
}
exports.random_scalar = random_scalar;
//# sourceMappingURL=index.js.map
