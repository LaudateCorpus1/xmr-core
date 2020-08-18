"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = __importStar(require("../crypto-ops"));
const xmr_fast_hash_1 = require("xmr-core/xmr-fast-hash");
const key_utils_1 = require("../key-utils");
const pid_1 = require("../pid");
class DefaultDevice {
    constructor() {
        this.name = "";
    }
    /* ======================================================================= */
    /*                              SETUP/TEARDOWN                             */
    /* ======================================================================= */
    // #region  SETUP/TEARDOWN
    set_name(name) {
        this.name = name;
        return true;
    }
    get_name() {
        return this.name;
    }
    set_mode(_mode) {
        return __awaiter(this, void 0, void 0, function* () {
            return true;
        });
    }
    // #endregion  SETUP/TEARDOWN
    /* ======================================================================= */
    /*                             WALLET & ADDRESS                            */
    /* ======================================================================= */
    // #region WALLET & ADDRESS
    get_public_address() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.notSupported();
        });
    }
    get_secret_keys() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.notSupported();
        });
    }
    generate_chacha_key(_keys) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.notSupported();
        });
    }
    // #endregion WALLET & ADDRESS
    /* ======================================================================= */
    /*                               SUB ADDRESS                               */
    /* ======================================================================= */
    // #region SUB ADDRESS
    derive_subaddress_public_key(out_key, derivation, output_index) {
        return __awaiter(this, void 0, void 0, function* () {
            return crypto.derivation.derive_subaddress_public_key(out_key, derivation, output_index);
        });
    }
    get_subaddress_spend_public_key(keys, index) {
        return __awaiter(this, void 0, void 0, function* () {
            if (index.isZero()) {
                return keys.m_account_address.spend_public_key;
            }
            return this.notSupported();
        });
    }
    get_subaddress_spend_public_keys(_keys, _account, _begin, _end) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.notSupported();
        });
    }
    get_subaddress(keys, index) {
        return __awaiter(this, void 0, void 0, function* () {
            if (index.isZero()) {
                return keys.m_account_address;
            }
            return this.notSupported();
        });
    }
    get_subaddress_secret_key(_sec, _index) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.notSupported();
        });
    }
    /* ======================================================================= */
    /*                            DERIVATION & KEY                             */
    /* ======================================================================= */
    // #region DERIVATION & KEY
    put_key(_privViewKey, _pubViewKey, _privSpendKey, _pubSpendKey, _b58PubKey) {
        return __awaiter(this, void 0, void 0, function* () {
            return true;
        });
    }
    verify_keys(secretKey, publicKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const calculatedPubKey = key_utils_1.secret_key_to_public_key(secretKey);
            return calculatedPubKey === publicKey;
        });
    }
    scalarmultKey(P, a) {
        return __awaiter(this, void 0, void 0, function* () {
            return crypto.primitive_ops.ge_scalarmult(P, a);
        });
    }
    scalarmultBase(a) {
        return __awaiter(this, void 0, void 0, function* () {
            return crypto.primitive_ops.ge_scalarmult_base(a);
        });
    }
    sc_secret_add(a, b) {
        return __awaiter(this, void 0, void 0, function* () {
            return crypto.primitive_ops.sc_add(a, b);
        });
    }
    generate_keys(recoveryKey) {
        return __awaiter(this, void 0, void 0, function* () {
            if (recoveryKey) {
                return key_utils_1.generate_keys(recoveryKey);
            }
            return key_utils_1.random_keypair();
        });
    }
    generate_key_derivation(pub, sec) {
        return __awaiter(this, void 0, void 0, function* () {
            return crypto.derivation.generate_key_derivation(pub, sec);
        });
    }
    conceal_derivation(derivation, _tx_pub_key, _additional_tx_pub_keys, _main_derivation, _additional_derivations) {
        return __awaiter(this, void 0, void 0, function* () {
            return derivation;
        });
    }
    derivation_to_scalar(derivation, output_index) {
        return __awaiter(this, void 0, void 0, function* () {
            return crypto.derivation.derivation_to_scalar(derivation, output_index);
        });
    }
    derive_secret_key(derivation, output_index, sec) {
        return __awaiter(this, void 0, void 0, function* () {
            return crypto.derivation.derive_secret_key(derivation, output_index, sec);
        });
    }
    derive_public_key(derivation, output_index, pub) {
        return __awaiter(this, void 0, void 0, function* () {
            return crypto.derivation.derive_public_key(derivation, output_index, pub);
        });
    }
    generate_key_image(pub, sec) {
        return __awaiter(this, void 0, void 0, function* () {
            return crypto.key_image.generate_key_image(pub, sec);
        });
    }
    secret_key_to_public_key(sec) {
        return __awaiter(this, void 0, void 0, function* () {
            return key_utils_1.secret_key_to_public_key(sec);
        });
    }
    /* ======================================================================= */
    /*                               TRANSACTION                               */
    /* ======================================================================= */
    // #region TRANSACTION
    open_tx() {
        return __awaiter(this, void 0, void 0, function* () {
            const { sec } = key_utils_1.random_keypair();
            return sec;
        });
    }
    encrypt_payment_id(paymentId, public_key, secret_key) {
        return __awaiter(this, void 0, void 0, function* () {
            return pid_1.encrypt_payment_id(paymentId, public_key, secret_key);
        });
    }
    decrypt_payment_id(paymentId, public_key, secret_key) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.encrypt_payment_id(paymentId, public_key, secret_key);
        });
    }
    ecdhEncode(unmasked, sharedSec) {
        return __awaiter(this, void 0, void 0, function* () {
            return crypto.rctOps.encode_ecdh(unmasked, sharedSec);
        });
    }
    ecdhDecode(masked, sharedSec) {
        return __awaiter(this, void 0, void 0, function* () {
            return crypto.rctOps.decode_ecdh(masked, sharedSec);
        });
    }
    add_output_key_mapping(_Aout, _Bout, _is_subaddress, _real_output_index, _amount_key, _out_eph_public_key) {
        return true;
    }
    mlsag_prehash(_blob, _inputs_size, _outputs_size, hashes, _outPk) {
        return __awaiter(this, void 0, void 0, function* () {
            return xmr_fast_hash_1.cn_fast_hash(hashes.join(""));
        });
    }
    mlsag_prepare(H, xx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sec: a, pub: aG } = key_utils_1.random_keypair();
            if (H && xx) {
                const aHP = yield this.scalarmultKey(H, a);
                const II = yield this.scalarmultKey(H, xx);
                return { a, aG, aHP, II };
            }
            else {
                return { a, aG };
            }
        });
    }
    mlsag_hash(toHash) {
        return __awaiter(this, void 0, void 0, function* () {
            return crypto.hash_ops.hash_to_scalar(toHash.join(""));
        });
    }
    mlsag_sign(c, xx, alpha, rows, dsRows, ss) {
        return __awaiter(this, void 0, void 0, function* () {
            if (dsRows > rows) {
                throw Error("dsRows greater than rows");
            }
            if (xx.length !== rows) {
                throw Error("xx size does not match rows");
            }
            if (alpha.length !== rows) {
                throw Error("alpha size does not match rows");
            }
            for (let j = 0; j < rows; j++) {
                ss[j] = crypto.primitive_ops.sc_mulsub(c, xx[j], alpha[j]);
            }
            return ss;
        });
    }
    close_tx() {
        return __awaiter(this, void 0, void 0, function* () {
            return true;
        });
    }
    notSupported() {
        throw Error("This device function is not supported");
    }
}
exports.DefaultDevice = DefaultDevice;
//# sourceMappingURL=device-default.js.map
