"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xmr_varint_1 = require("xmr-core/xmr-varint");
const utils_1 = require("../utils");
const xmr_fast_hash_1 = require("xmr-core/xmr-fast-hash");
const prove_range_1 = require("./components/prove_range");
function serialize_rct_tx_with_hash(tx) {
    if (!tx.rct_signatures) {
        throw Error("This transaction does not contain rct_signatures");
    }
    let hashes = "";
    let buf = "";
    buf += utils_1.serializeTxHeader(tx);
    hashes += xmr_fast_hash_1.cn_fast_hash(buf);
    const buf2 = serialize_rct_base(tx.rct_signatures);
    hashes += xmr_fast_hash_1.cn_fast_hash(buf2);
    buf += buf2;
    let buf3 = prove_range_1.serialize_range_proofs(tx.rct_signatures);
    //add MGs
    for (let i = 0; i < tx.rct_signatures.p.MGs.length; i++) {
        for (let j = 0; j < tx.rct_signatures.p.MGs[i].ss.length; j++) {
            buf3 += tx.rct_signatures.p.MGs[i].ss[j][0];
            buf3 += tx.rct_signatures.p.MGs[i].ss[j][1];
        }
        buf3 += tx.rct_signatures.p.MGs[i].cc;
    }
    hashes += xmr_fast_hash_1.cn_fast_hash(buf3);
    buf += buf3;
    const hash = xmr_fast_hash_1.cn_fast_hash(hashes);
    return {
        raw: buf,
        hash: hash,
    };
}
exports.serialize_rct_tx_with_hash = serialize_rct_tx_with_hash;
function serialize_rct_base(rv) {
    let buf = "";
    buf += xmr_varint_1.encode_varint(rv.type);
    buf += xmr_varint_1.encode_varint(rv.txnFee);
    if (rv.type === 2) {
        for (let i = 0; i < rv.pseudoOuts.length; i++) {
            buf += rv.pseudoOuts[i];
        }
    }
    if (rv.ecdhInfo.length !== rv.outPk.length) {
        throw Error("mismatched outPk/ecdhInfo!");
    }
    for (let i = 0; i < rv.ecdhInfo.length; i++) {
        buf += rv.ecdhInfo[i].mask;
        buf += rv.ecdhInfo[i].amount;
    }
    for (let i = 0; i < rv.outPk.length; i++) {
        buf += rv.outPk[i].mask;
    }
    return buf;
}
exports.serialize_rct_base = serialize_rct_base;
//# sourceMappingURL=serialization.js.map
