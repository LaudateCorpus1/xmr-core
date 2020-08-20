"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const primitive_ops_1 = require("./primitive_ops");
const constants_1 = require("./constants");
const xmr_str_utils_1 = require("../../../xmr-str-utils");
const hash_ops_1 = require("./hash_ops");
const derivation_1 = require("./derivation");
const device_1 = require("../device");
//creates a Pedersen commitment from an amount (in scalar form) and a mask
//C = bG + aH where b = mask, a = amount
function commit(amount, mask) {
    if (!xmr_str_utils_1.valid_hex(mask) ||
        mask.length !== 64 ||
        !xmr_str_utils_1.valid_hex(amount) ||
        amount.length !== 64) {
        throw Error("invalid amount or mask!");
    }
    const C = primitive_ops_1.ge_double_scalarmult_base_vartime(amount, constants_1.H, mask);
    return C;
}
exports.commit = commit;
function zeroCommit(amount) {
    return commit(amount, constants_1.I);
}
exports.zeroCommit = zeroCommit;
function decode_ecdh(ecdh, key) {
    const first = hash_ops_1.hash_to_scalar(key);
    const second = hash_ops_1.hash_to_scalar(first);
    return {
        mask: primitive_ops_1.sc_sub(ecdh.mask, first),
        amount: primitive_ops_1.sc_sub(ecdh.amount, second),
    };
}
exports.decode_ecdh = decode_ecdh;
function encode_ecdh(ecdh, key) {
    const first = hash_ops_1.hash_to_scalar(key);
    const second = hash_ops_1.hash_to_scalar(first);
    return {
        mask: primitive_ops_1.sc_add(ecdh.mask, first),
        amount: primitive_ops_1.sc_add(ecdh.amount, second),
    };
}
exports.encode_ecdh = encode_ecdh;
function generate_key_image_helper(keys, tx_pub_key, out_index, enc_mask, hwdev) {
    return __awaiter(this, void 0, void 0, function* () {
        const recv_derivation = yield hwdev.generate_key_derivation(tx_pub_key, keys.view.sec);
        if (!recv_derivation)
            throw Error("Failed to generate key image");
        const maskFunc = (derivation) => enc_mask
            ? primitive_ops_1.sc_sub(enc_mask, hash_ops_1.hash_to_scalar(derivation_1.derivation_to_scalar(derivation, out_index)))
            : constants_1.I; //decode mask, or d2s(1) if no mask
        let mask = "";
        // wallet2::light_wallet_parse_rct_str
        if (hwdev instanceof device_1.LedgerDevice) {
            const privViewKey = yield hwdev.export_private_view_key();
            const derivation = derivation_1.generate_key_derivation(tx_pub_key, privViewKey);
            mask = maskFunc(derivation);
        }
        else {
            mask = maskFunc(recv_derivation);
        }
        const ephemeral_sec = yield hwdev.derive_secret_key(recv_derivation, out_index, keys.spend.sec);
        const ephemeral_pub = yield hwdev.secret_key_to_public_key(ephemeral_sec);
        if (!ephemeral_pub)
            throw Error("Failed to generate key image");
        const key_image = yield hwdev.generate_key_image(ephemeral_pub, ephemeral_sec);
        return {
            in_ephemeral: {
                pub: ephemeral_pub,
                sec: ephemeral_sec,
                mask,
            },
            key_image,
        };
    });
}
exports.generate_key_image_helper = generate_key_image_helper;
function scalarmultH(scalar) {
    return primitive_ops_1.ge_scalarmult(constants_1.H, scalar);
}
exports.scalarmultH = scalarmultH;
//# sourceMappingURL=rct.js.map
