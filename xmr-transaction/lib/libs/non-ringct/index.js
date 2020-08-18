"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const xmr_crypto_utils_1 = require("xmr-core/xmr-crypto-utils");
const xmr_str_utils_1 = require("xmr-core/xmr-str-utils");
const xmr_vendor_1 = require("xmr-core/xmr-vendor");
const { STRUCT_SIZES, KEY_SIZE, HASH_SIZE } = xmr_crypto_utils_1.constants;
const { hash_to_ec, hash_to_scalar } = xmr_crypto_utils_1.hash_ops;
__export(require("./serialization"));
function generate_ring_signature(prefix_hash, k_image, keys, sec, real_index) {
    if (k_image.length !== STRUCT_SIZES.KEY_IMAGE * 2) {
        throw Error("invalid key image length");
    }
    if (sec.length !== KEY_SIZE * 2) {
        throw Error("Invalid secret key length");
    }
    if (prefix_hash.length !== HASH_SIZE * 2 || !xmr_str_utils_1.valid_hex(prefix_hash)) {
        throw Error("Invalid prefix hash");
    }
    if (real_index >= keys.length || real_index < 0) {
        throw Error("real_index is invalid");
    }
    const _ge_tobytes = xmr_vendor_1.CNCrypto.cwrap("ge_tobytes", "void", [
        "number",
        "number",
    ]);
    const _ge_p3_tobytes = xmr_vendor_1.CNCrypto.cwrap("ge_p3_tobytes", "void", [
        "number",
        "number",
    ]);
    const _ge_scalarmult_base = xmr_vendor_1.CNCrypto.cwrap("ge_scalarmult_base", "void", [
        "number",
        "number",
    ]);
    const _ge_scalarmult = xmr_vendor_1.CNCrypto.cwrap("ge_scalarmult", "void", [
        "number",
        "number",
        "number",
    ]);
    const _sc_add = xmr_vendor_1.CNCrypto.cwrap("sc_add", "void", [
        "number",
        "number",
        "number",
    ]);
    const _sc_sub = xmr_vendor_1.CNCrypto.cwrap("sc_sub", "void", [
        "number",
        "number",
        "number",
    ]);
    const _sc_mulsub = xmr_vendor_1.CNCrypto.cwrap("sc_mulsub", "void", [
        "number",
        "number",
        "number",
        "number",
    ]);
    const _sc_0 = xmr_vendor_1.CNCrypto.cwrap("sc_0", "void", ["number"]);
    const _ge_double_scalarmult_base_vartime = xmr_vendor_1.CNCrypto.cwrap("ge_double_scalarmult_base_vartime", "void", ["number", "number", "number", "number"]);
    const _ge_double_scalarmult_precomp_vartime = xmr_vendor_1.CNCrypto.cwrap("ge_double_scalarmult_precomp_vartime", "void", ["number", "number", "number", "number", "number"]);
    const _ge_frombytes_vartime = xmr_vendor_1.CNCrypto.cwrap("ge_frombytes_vartime", "number", ["number", "number"]);
    const _ge_dsm_precomp = xmr_vendor_1.CNCrypto.cwrap("ge_dsm_precomp", "void", [
        "number",
        "number",
    ]);
    const buf_size = STRUCT_SIZES.EC_POINT * 2 * keys.length;
    const buf_m = xmr_vendor_1.CNCrypto._malloc(buf_size);
    const sig_size = STRUCT_SIZES.SIGNATURE * keys.length;
    const sig_m = xmr_vendor_1.CNCrypto._malloc(sig_size);
    // Struct pointer helper functions
    function buf_a(i) {
        return buf_m + STRUCT_SIZES.EC_POINT * (2 * i);
    }
    function buf_b(i) {
        return buf_m + STRUCT_SIZES.EC_POINT * (2 * i + 1);
    }
    function sig_c(i) {
        return sig_m + STRUCT_SIZES.EC_SCALAR * (2 * i);
    }
    function sig_r(i) {
        return sig_m + STRUCT_SIZES.EC_SCALAR * (2 * i + 1);
    }
    const image_m = xmr_vendor_1.CNCrypto._malloc(STRUCT_SIZES.KEY_IMAGE);
    xmr_vendor_1.CNCrypto.HEAPU8.set(xmr_str_utils_1.hextobin(k_image), image_m);
    let i;
    const image_unp_m = xmr_vendor_1.CNCrypto._malloc(STRUCT_SIZES.GE_P3);
    const image_pre_m = xmr_vendor_1.CNCrypto._malloc(STRUCT_SIZES.GE_DSMP);
    const sum_m = xmr_vendor_1.CNCrypto._malloc(STRUCT_SIZES.EC_SCALAR);
    const k_m = xmr_vendor_1.CNCrypto._malloc(STRUCT_SIZES.EC_SCALAR);
    const h_m = xmr_vendor_1.CNCrypto._malloc(STRUCT_SIZES.EC_SCALAR);
    const tmp2_m = xmr_vendor_1.CNCrypto._malloc(STRUCT_SIZES.GE_P2);
    const tmp3_m = xmr_vendor_1.CNCrypto._malloc(STRUCT_SIZES.GE_P3);
    const pub_m = xmr_vendor_1.CNCrypto._malloc(KEY_SIZE);
    const sec_m = xmr_vendor_1.CNCrypto._malloc(KEY_SIZE);
    xmr_vendor_1.CNCrypto.HEAPU8.set(xmr_str_utils_1.hextobin(sec), sec_m);
    if (_ge_frombytes_vartime(image_unp_m, image_m) != 0) {
        throw Error("failed to call ge_frombytes_vartime");
    }
    _ge_dsm_precomp(image_pre_m, image_unp_m);
    _sc_0(sum_m);
    for (i = 0; i < keys.length; i++) {
        if (i === real_index) {
            // Real key
            const rand = xmr_crypto_utils_1.random_scalar();
            xmr_vendor_1.CNCrypto.HEAPU8.set(xmr_str_utils_1.hextobin(rand), k_m);
            _ge_scalarmult_base(tmp3_m, k_m);
            _ge_p3_tobytes(buf_a(i), tmp3_m);
            const ec = hash_to_ec(keys[i]);
            xmr_vendor_1.CNCrypto.HEAPU8.set(xmr_str_utils_1.hextobin(ec), tmp3_m);
            _ge_scalarmult(tmp2_m, k_m, tmp3_m);
            _ge_tobytes(buf_b(i), tmp2_m);
        }
        else {
            xmr_vendor_1.CNCrypto.HEAPU8.set(xmr_str_utils_1.hextobin(xmr_crypto_utils_1.random_scalar()), sig_c(i));
            xmr_vendor_1.CNCrypto.HEAPU8.set(xmr_str_utils_1.hextobin(xmr_crypto_utils_1.random_scalar()), sig_r(i));
            xmr_vendor_1.CNCrypto.HEAPU8.set(xmr_str_utils_1.hextobin(keys[i]), pub_m);
            if (xmr_vendor_1.CNCrypto.ccall("ge_frombytes_vartime", "void", ["number", "number"], [tmp3_m, pub_m]) !== 0) {
                throw Error("Failed to call ge_frombytes_vartime");
            }
            _ge_double_scalarmult_base_vartime(tmp2_m, sig_c(i), tmp3_m, sig_r(i));
            _ge_tobytes(buf_a(i), tmp2_m);
            const ec = hash_to_ec(keys[i]);
            xmr_vendor_1.CNCrypto.HEAPU8.set(xmr_str_utils_1.hextobin(ec), tmp3_m);
            _ge_double_scalarmult_precomp_vartime(tmp2_m, sig_r(i), tmp3_m, sig_c(i), image_pre_m);
            _ge_tobytes(buf_b(i), tmp2_m);
            _sc_add(sum_m, sum_m, sig_c(i));
        }
    }
    const buf_bin = xmr_vendor_1.CNCrypto.HEAPU8.subarray(buf_m, buf_m + buf_size);
    const scalar = hash_to_scalar(prefix_hash + xmr_str_utils_1.bintohex(buf_bin));
    xmr_vendor_1.CNCrypto.HEAPU8.set(xmr_str_utils_1.hextobin(scalar), h_m);
    _sc_sub(sig_c(real_index), h_m, sum_m);
    _sc_mulsub(sig_r(real_index), sig_c(real_index), sec_m, k_m);
    const sig_data = xmr_str_utils_1.bintohex(xmr_vendor_1.CNCrypto.HEAPU8.subarray(sig_m, sig_m + sig_size));
    const sigs = [];
    for (let k = 0; k < keys.length; k++) {
        sigs.push(sig_data.slice(STRUCT_SIZES.SIGNATURE * 2 * k, STRUCT_SIZES.SIGNATURE * 2 * (k + 1)));
    }
    xmr_vendor_1.CNCrypto._free(image_m);
    xmr_vendor_1.CNCrypto._free(image_unp_m);
    xmr_vendor_1.CNCrypto._free(image_pre_m);
    xmr_vendor_1.CNCrypto._free(sum_m);
    xmr_vendor_1.CNCrypto._free(k_m);
    xmr_vendor_1.CNCrypto._free(h_m);
    xmr_vendor_1.CNCrypto._free(tmp2_m);
    xmr_vendor_1.CNCrypto._free(tmp3_m);
    xmr_vendor_1.CNCrypto._free(buf_m);
    xmr_vendor_1.CNCrypto._free(sig_m);
    xmr_vendor_1.CNCrypto._free(pub_m);
    xmr_vendor_1.CNCrypto._free(sec_m);
    return sigs;
}
exports.generate_ring_signature = generate_ring_signature;
//# sourceMappingURL=index.js.map
