"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xmr_fast_hash_1 = require("../../../xmr-fast-hash");
const xmr_constants_1 = require("../../../xmr-constants");
const xmr_str_utils_1 = require("../../../xmr-str-utils");
const rand_1 = require("../rand");
const derivation_1 = require("../crypto-ops/derivation");
function makePaymentID() {
    return rand_1.rand_8();
}
exports.makePaymentID = makePaymentID;
function encrypt_payment_id(payment_id, public_key, secret_key) {
    // get the derivation from our passed viewkey, then hash that + tail to get encryption key
    const INTEGRATED_ID_SIZE_BYTES = xmr_constants_1.INTEGRATED_ID_SIZE * 2;
    const ENCRYPTED_PAYMENT_ID_TAIL_BYTE = "8d";
    const derivation = derivation_1.generate_key_derivation(public_key, secret_key);
    const data = `${derivation}${ENCRYPTED_PAYMENT_ID_TAIL_BYTE}`;
    const pid_key = xmr_fast_hash_1.cn_fast_hash(data).slice(0, INTEGRATED_ID_SIZE_BYTES);
    const encryptedPid = xmr_str_utils_1.hex_xor(payment_id, pid_key);
    return encryptedPid;
}
exports.encrypt_payment_id = encrypt_payment_id;
function isValidOrNoPaymentID(pid) {
    if (!pid) {
        return true;
    }
    return isValidShortPaymentID(pid) || isValidLongPaymentID(pid);
}
exports.isValidOrNoPaymentID = isValidOrNoPaymentID;
function isValidShortPaymentID(payment_id) {
    return isValidPaymentID(payment_id, 16);
}
exports.isValidShortPaymentID = isValidShortPaymentID;
function isValidLongPaymentID(payment_id) {
    console.warn("[WARN]: Long payment (plaintext) ids are deprecated");
    return isValidPaymentID(payment_id, 64);
}
exports.isValidLongPaymentID = isValidLongPaymentID;
function isValidPaymentID(payment_id, length) {
    const pattern = RegExp("^[0-9a-fA-F]{" + length + "}$");
    return pattern.test(payment_id);
}
//# sourceMappingURL=index.js.map
