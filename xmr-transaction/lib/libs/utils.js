"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xmr_varint_1 = require("@xmr-core/xmr-varint");
const xmr_fast_hash_1 = require("@xmr-core/xmr-fast-hash");
const xmr_str_utils_1 = require("@xmr-core/xmr-str-utils");
const biginteger_1 = require("@xmr-core/biginteger");
const TX_EXTRA_NONCE_MAX_COUNT = 255;
const TX_EXTRA_TAGS = {
    PADDING: "00",
    PUBKEY: "01",
    NONCE: "02",
    MERGE_MINING: "03",
};
const TX_EXTRA_NONCE_TAGS = {
    PAYMENT_ID: "00",
    ENCRYPTED_PAYMENT_ID: "01",
};
function add_pub_key_to_extra(extra, pubkey) {
    if (pubkey.length !== 64)
        throw Error("Invalid pubkey length");
    // Append pubkey tag and pubkey
    extra += TX_EXTRA_TAGS.PUBKEY + pubkey;
    return extra;
}
exports.add_pub_key_to_extra = add_pub_key_to_extra;
function add_nonce_to_extra(extra, nonce) {
    // Append extra nonce
    if (nonce.length % 2 !== 0) {
        throw Error("Invalid extra nonce");
    }
    if (nonce.length / 2 > TX_EXTRA_NONCE_MAX_COUNT) {
        throw Error("Extra nonce must be at most " +
            TX_EXTRA_NONCE_MAX_COUNT +
            " bytes");
    }
    // Add nonce tag
    extra += TX_EXTRA_TAGS.NONCE;
    // Encode length of nonce
    extra += ("0" + (nonce.length / 2).toString(16)).slice(-2);
    // Write nonce
    extra += nonce;
    return extra;
}
exports.add_nonce_to_extra = add_nonce_to_extra;
function get_payment_id_nonce(payment_id, pid_encrypt) {
    if (payment_id.length !== 64 && payment_id.length !== 16) {
        throw Error("Invalid payment id");
    }
    let res = "";
    if (pid_encrypt) {
        res += TX_EXTRA_NONCE_TAGS.ENCRYPTED_PAYMENT_ID;
    }
    else {
        res += TX_EXTRA_NONCE_TAGS.PAYMENT_ID;
    }
    res += payment_id;
    return res;
}
exports.get_payment_id_nonce = get_payment_id_nonce;
function abs_to_rel_offsets(offsets) {
    if (offsets.length === 0)
        return offsets;
    for (let i = offsets.length - 1; i >= 1; --i) {
        offsets[i] = new biginteger_1.BigInt(offsets[i]).subtract(offsets[i - 1]).toString();
    }
    return offsets;
}
exports.abs_to_rel_offsets = abs_to_rel_offsets;
function serializeTxHeader(tx) {
    let buf = "";
    buf += xmr_varint_1.encode_varint(tx.version);
    buf += xmr_varint_1.encode_varint(tx.unlock_time);
    buf += xmr_varint_1.encode_varint(tx.vin.length);
    for (let i = 0; i < tx.vin.length; i++) {
        const vin = tx.vin[i];
        switch (vin.type) {
            case "input_to_key":
                buf += "02";
                buf += xmr_varint_1.encode_varint(vin.amount);
                buf += xmr_varint_1.encode_varint(vin.key_offsets.length);
                for (let j = 0; j < vin.key_offsets.length; j++) {
                    buf += xmr_varint_1.encode_varint(vin.key_offsets[j]);
                }
                buf += vin.k_image;
                break;
            default:
                throw Error("Unhandled vin type: " + vin.type);
        }
    }
    buf += xmr_varint_1.encode_varint(tx.vout.length);
    for (let i = 0; i < tx.vout.length; i++) {
        const vout = tx.vout[i];
        buf += xmr_varint_1.encode_varint(vout.amount);
        switch (vout.target.type) {
            case "txout_to_key":
                buf += "02";
                buf += vout.target.key;
                break;
            default:
                throw Error("Unhandled txout target type: " + vout.target.type);
        }
    }
    if (!xmr_str_utils_1.valid_hex(tx.extra)) {
        throw Error("Tx extra has invalid hex");
    }
    buf += xmr_varint_1.encode_varint(tx.extra.length / 2);
    buf += tx.extra;
    return buf;
}
exports.serializeTxHeader = serializeTxHeader;
function get_tx_prefix_hash(tx) {
    const prefix = serializeTxHeader(tx);
    return xmr_fast_hash_1.cn_fast_hash(prefix);
}
exports.get_tx_prefix_hash = get_tx_prefix_hash;
//# sourceMappingURL=utils.js.map