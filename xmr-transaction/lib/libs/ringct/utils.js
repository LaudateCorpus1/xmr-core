"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serialization_1 = require("./serialization");
const xmr_fast_hash_1 = require("../../../../xmr-fast-hash");
const prove_range_1 = require("./components/prove_range");
function get_pre_mlsag_hash(rv, mixRing, hwdev) {
    let hashes = [];
    hashes.push(rv.message);
    const ss = serialization_1.serialize_rct_base(rv);
    hashes.push(xmr_fast_hash_1.cn_fast_hash(ss));
    hashes.push(xmr_fast_hash_1.cn_fast_hash(prove_range_1.serialize_range_proofs(rv)));
    // if simple
    const inputs_size = rv.type === 0x02 ? mixRing.length : mixRing[0].length;
    const outputs_size = rv.ecdhInfo.length;
    return hwdev.mlsag_prehash(ss, inputs_size, outputs_size, hashes, rv.outPk);
}
exports.get_pre_mlsag_hash = get_pre_mlsag_hash;
function estimateRctSize(inputs, mixin, outputs) {
    let size = 0;
    // tx prefix
    // first few bytes
    size += 1 + 6;
    size += inputs * (1 + 6 + (mixin + 1) * 3 + 32); // original C implementation is *2+32 but author advised to change 2 to 3 as key offsets are variable size and this constitutes a best guess
    // vout
    size += outputs * (6 + 32);
    // extra
    size += 40;
    // rct signatures
    // type
    size += 1;
    // rangeSigs
    size += (2 * 64 * 32 + 32 + 64 * 32) * outputs;
    // MGs
    size += inputs * (32 * (mixin + 1) + 32);
    // mixRing - not serialized, can be reconstructed
    /* size += 2 * 32 * (mixin+1) * inputs; */
    // pseudoOuts
    size += 32 * inputs;
    // ecdhInfo
    size += 2 * 32 * outputs;
    // outPk - only commitment is saved
    size += 32 * outputs;
    // txnFee
    size += 4;
    return size;
}
exports.estimateRctSize = estimateRctSize;
//# sourceMappingURL=utils.js.map
