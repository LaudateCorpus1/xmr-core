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
const commands_1 = require("./commands");
const types_1 = require("../types");
const crypto = __importStar(require("../../crypto-ops"));
const xmr_str_utils_1 = require("xmr-core/xmr-str-utils");
var RCT;
(function (RCT) {
    RCT[RCT["RCTTypeNull"] = 0] = "RCTTypeNull";
    RCT[RCT["RCTTypeFull"] = 1] = "RCTTypeFull";
    RCT[RCT["RCTTypeSimple"] = 2] = "RCTTypeSimple";
    RCT[RCT["RCTTypeFullBulletproof"] = 3] = "RCTTypeFullBulletproof";
    RCT[RCT["RCTTypeSimpleBulletproof"] = 4] = "RCTTypeSimpleBulletproof";
})(RCT || (RCT = {}));
class Keymap {
    constructor() {
        this.map = {};
    }
    add(keys) {
        if (this.map[keys.Pout]) {
            throw Error(`Cannot add key to map, Pout: ${keys.Pout} already exists`);
        }
        this.map[keys.Pout] = keys;
    }
    find(Pout) {
        return this.map[Pout];
    }
    clear() {
        this.map = {};
    }
}
const ledgerLog = (fnname, obj, extra) => xmr_str_utils_1.JSONPrettyPrint(`LedgerDevice ${fnname}`, obj, extra);
// tslint:disable-next-line:max-classes-per-file
class LedgerDevice {
    constructor(transport) {
        this.null_skey = this.hexString();
        this.key_map = new Keymap();
        this.transport = transport;
        this.name = "";
        this.mode = types_1.DeviceMode.NONE;
        this.has_view_key = false;
        this.privateViewKey = this.hexString();
        transport.decorateAppAPIMethods(this, [
            "set_mode",
            "put_key",
            "get_public_address",
            "get_secret_keys",
            "derive_subaddress_public_key",
            "get_subaddress_spend_public_key",
            "get_subaddress",
            "get_subaddress_secret_key",
            "verify_keys",
            "scalarmultKey",
            "scalarmultBase",
            "sc_secret_add",
            "generate_keys",
            "generate_key_derivation",
            "derivation_to_scalar",
            "derive_secret_key",
            "derive_public_key",
            "secret_key_to_public_key",
            "generate_key_image",
            "open_tx",
            "encrypt_payment_id",
            "ecdhEncode",
            "ecdhDecode",
            "mlsag_prehash",
            "mlsag_prepare",
            "mlsag_hash",
            "mlsag_sign",
            "close_tx",
        ], "MOON");
        transport.setScrambleKey("MOON");
    }
    /* ======================================================================= */
    /*                                   MISC                                  */
    /* ======================================================================= */
    // #region  MISC
    reset() {
        return this.send(commands_1.INS.RESET, 0x00, 0x00);
    }
    // #endregion  MISC
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
    set_mode(mode) {
        return __awaiter(this, void 0, void 0, function* () {
            ledgerLog("set_mode", { mode }, "args");
            switch (mode) {
                case types_1.DeviceMode.TRANSACTION_CREATE_REAL:
                case types_1.DeviceMode.TRANSACTION_CREATE_FAKE:
                    yield this.send(commands_1.INS.SET_SIGNATURE_MODE, 0x01, 0x00, [
                        0x00,
                        mode,
                    ]);
                    this.mode = mode;
                    break;
                case types_1.DeviceMode.TRANSACTION_PARSE:
                case types_1.DeviceMode.NONE:
                    this.mode = mode;
                    break;
                default:
                    throw Error(`device_ledger::set_mode(unsigned int mode): invalid mode ${mode}`);
            }
            console.log(`Switched to mode: ${mode}`);
            return true;
        });
    }
    // #endregion  SETUP/TEARDOWN
    /* ======================================================================= */
    /*                             WALLET & ADDRESS                            */
    /* ======================================================================= */
    // #region WALLET & ADDRESS
    put_key(privViewKey, pubViewKey, privSpendKey, pubSpendKey, _b58PubKey) {
        return __awaiter(this, void 0, void 0, function* () {
            ledgerLog("put_key", {
                privViewKey,
                pubViewKey,
                privSpendKey,
                pubSpendKey,
                _b58PubKey,
            }, "args");
            yield this.send(commands_1.INS.PUT_KEY, 0x00, 0x00, [
                0x00,
                privViewKey,
                pubViewKey,
                privSpendKey,
                pubSpendKey,
                // dummy pub key just to bypass length verification
                // isnt used in blue-app-monero code for anything else
                "bc3b105abc2f939571e5b107ab58dc4f6ea22923d8189be54a47d107d187d901bc3b105abc2f939571e5b107ab58dc4f6ea22923d8189be54a47d107d187d901bc3b105abc2f939571e5b107ab58dc4f6ea22923d8189be54a47d107d187",
            ]);
            return true;
        });
    }
    get_public_address() {
        return __awaiter(this, void 0, void 0, function* () {
            ledgerLog("get_public_address", { command: "get_public_address" });
            const [view_public_key, spend_public_key] = yield this.send(commands_1.INS.GET_KEY, 0x01, 0x00, [0x00], [32, 64]);
            ledgerLog("get_public_address", {
                view_public_key,
                spend_public_key,
            }, "ret");
            return {
                view_public_key,
                spend_public_key,
            };
        });
    }
    /**
     *
     * @description Retrives the secret view key if the user allows the export
     * Skips retriving the view key if already previously exported
     * @returns Fake view and send private key
     * @memberof XMR
     */
    get_secret_keys() {
        return __awaiter(this, void 0, void 0, function* () {
            // secret keys are represented as fake keys on the wallet side
            // because secret keys are always in possesion of the ledger device
            const vkey = this.hexString();
            const skey = this.hexString(0xff);
            ledgerLog("get_secret_keys", { command: "get_secret_keys" });
            if (this.is_fake_view_key(this.privateViewKey)) {
                const [viewKey] = yield this.send(commands_1.INS.GET_KEY, 0x02, 0x00, [0x00], [32]);
                this.privateViewKey = viewKey;
            }
            this.has_view_key = !this.is_fake_view_key(this.privateViewKey);
            ledgerLog("get_secret_keys", { viewKey: vkey, spendKey: skey }, "ret");
            return { viewKey: vkey, spendKey: skey };
        });
    }
    export_private_view_key() {
        return __awaiter(this, void 0, void 0, function* () {
            ledgerLog("export_private_view_key", {
                command: "export_private_view_key",
            });
            if (this.is_fake_view_key(this.privateViewKey)) {
                yield this.get_secret_keys();
            }
            ledgerLog("export_private_view_key", { viewKey: this.privateViewKey }, "ret");
            return this.privateViewKey;
        });
    }
    generate_chacha_key(_keys) {
        return __awaiter(this, void 0, void 0, function* () {
            const [] = yield this.send(commands_1.INS.GET_CHACHA8_PREKEY, 0x00, 0x00, [0x00], [200]);
            return this.notSupported();
        });
    }
    // #endregion WALLET & ADDRESS
    /* ======================================================================= */
    /*                               SUB ADDRESS                               */
    /* ======================================================================= */
    // #region SUB ADDRESS
    /**
     *
     * @param {PublicKey} pub
     * @param {KeyDerivation} derivation
     * @param {number} output_index
     * @returns {Promise<PublicKey>}
     * @memberof XMR
     */
    derive_subaddress_public_key(pub, derivation, output_index) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.mode === types_1.DeviceMode.TRANSACTION_PARSE && this.has_view_key) {
                //If we are in TRANSACTION_PARSE, the given derivation has been retrieved decrypted (without the help
                //of the device), so continue that way.
                return this.notSupported();
                // return this.extern.derive_subaddress_public_key(
                // pub,
                // derivation,
                // output_index,
                // );
            }
            else {
                const [derived_pub] = yield this.send(commands_1.INS.DERIVE_SUBADDRESS_PUBLIC_KEY, 0x00, 0x00, [
                    0x00,
                    pub,
                    derivation,
                    output_index >> 24,
                    output_index >> 16,
                    output_index >> 8,
                    output_index >> 0,
                ], [32]);
                return derived_pub;
            }
        });
    }
    get_subaddress_spend_public_key(keys, index) {
        return __awaiter(this, void 0, void 0, function* () {
            if (index.isZero()) {
                return keys.m_account_address.spend_public_key;
            }
            // decompress index, taking 4+4 bytes
            const [D] = yield this.send(commands_1.INS.GET_SUBADDRESS_SPEND_PUBLIC_KEY, 0x00, 0x00, [0x00, index.major, index.minor], [32]);
            return D;
        });
    }
    get_subaddress_spend_public_keys(keys, account, begin, end) {
        return __awaiter(this, void 0, void 0, function* () {
            const pkeys = [];
            for (let index = begin; index < end; index++) {
                pkeys.push(yield this.get_subaddress_spend_public_key(keys, {
                    major: account,
                    minor: index,
                    isZero: () => false,
                }));
            }
            return pkeys;
        });
    }
    get_subaddress(keys, index) {
        return __awaiter(this, void 0, void 0, function* () {
            if (index.isZero()) {
                return keys.m_account_address;
            }
            const [view_public_key, spend_public_key] = yield this.send(commands_1.INS.GET_SUBADDRESS, 0x00, 0x00, [0x00, index.major, index.minor], [32, 64]);
            return { view_public_key, spend_public_key };
        });
    }
    get_subaddress_secret_key(sec, index) {
        return __awaiter(this, void 0, void 0, function* () {
            const [sub_sec] = yield this.send(commands_1.INS.GET_SUBADDRESS_SECRET_KEY, 0x00, 0x00, [0x00, sec, index.major, index.minor], [32]);
            return sub_sec;
        });
    }
    // #endregion SUB ADDRESS
    /* ======================================================================= */
    /*                            DERIVATION & KEY                             */
    /* ======================================================================= */
    // #region DERIVATION & KEY
    verify_keys(secret_key, public_key) {
        return __awaiter(this, void 0, void 0, function* () {
            ledgerLog("verify_keys", { secret_key, public_key }, "args");
            const verifyArr = yield this.send(commands_1.INS.VERIFY_KEY, 0x00, 0x00, [0x00, secret_key, public_key], [1, 2, 3, 4]).then(arr => arr.map(str => parseInt(str, 16)));
            // TODO: support full 32 bit return value in the future
            // for any verification return value changes
            // but for now, we just need to check the last 4 bytes
            // to see if the last bit is 1 or not
            // const verified =
            // (verifyArr[0] << 24) |
            // (verifyArr[1] << 16) |
            // (verifyArr[2] << 8) |
            // (verifyArr[3] << 0);
            const verified = verifyArr[3];
            ledgerLog("verify_keys", { verified: verified === 1 }, "ret");
            return verified === 1;
        });
    }
    scalarmultKey(P, a) {
        return __awaiter(this, void 0, void 0, function* () {
            ledgerLog("scalarmultKey", { P, a }, "args");
            const [aP] = yield this.send(commands_1.INS.SECRET_SCAL_MUL_KEY, 0x00, 0x00, [0x00, P, a], [32]);
            ledgerLog("scalarmultKey", { aP }, "ret");
            return aP;
        });
    }
    scalarmultBase(a) {
        return __awaiter(this, void 0, void 0, function* () {
            ledgerLog("scalarmultBase", { a }, "args");
            const [aG] = yield this.send(commands_1.INS.SECRET_SCAL_MUL_BASE, 0x00, 0x00, [0x00, a], [32]);
            ledgerLog("scalarmultBase", { aG }, "args");
            return aG;
        });
    }
    sc_secret_add(a, b) {
        return __awaiter(this, void 0, void 0, function* () {
            ledgerLog("sc_secret_add", { a, b }, "args");
            const [r] = yield this.send(commands_1.INS.SECRET_KEY_ADD, 0x00, 0x00, [0x00, a, b], [32]);
            ledgerLog("sc_secret_add", { r }, "args");
            return r;
        });
    }
    generate_keys(recovery_key) {
        return __awaiter(this, void 0, void 0, function* () {
            ledgerLog("generate_keys", { command: "generate_keys" });
            if (recovery_key) {
                throw Error("Ledger device method generate_keys does not support recover");
            }
            const [pub, sec] = yield this.send(commands_1.INS.GENERATE_KEYPAIR, 0x00, 0x00, [0x00], [32, 64]);
            ledgerLog("generate_keys", { pub, sec }, "ret");
            return { pub, sec };
        });
    }
    generate_key_derivation(pub, sec) {
        return __awaiter(this, void 0, void 0, function* () {
            ledgerLog("generate_key_derivation", { pub, sec }, "args");
            if (this.mode === types_1.DeviceMode.TRANSACTION_PARSE && this.has_view_key) {
                // When a derivation is requested in PARSE mode and the view key is available,
                // Perform the derivation via extern library and return the derivation unencrypted
                console.log("generate_key_derivation  : PARSE mode with known viewkey");
                //Note derivation in PARSE mode can only happen with viewkey, so assert it! (?)
                if (this.is_fake_view_key(this.privateViewKey)) {
                    throw Error("Derivation in PARSE mode can only happen with viewkey");
                }
                const derivation = crypto.derivation.generate_key_derivation(pub, this.privateViewKey);
                return derivation;
            }
            else {
                const [derivation] = yield this.send(commands_1.INS.GEN_KEY_DERIVATION, 0x00, 0x00, [0x00, pub, sec], [32]);
                ledgerLog("generate_key_derivation", { derivation }, "ret");
                return derivation;
            }
        });
    }
    conceal_derivation(derivation, tx_pub_key, additional_tx_pub_keys, main_derivation, additional_derivations) {
        return __awaiter(this, void 0, void 0, function* () {
            ledgerLog("conceal_derivation", {
                derivation,
                tx_pub_key,
                additional_tx_pub_keys,
                main_derivation,
                additional_derivations,
            }, "args");
            let pubKey;
            if (derivation === main_derivation) {
                pubKey = tx_pub_key;
                console.log("conceal derivation with main tx pub key");
            }
            else {
                console.warn("conceal_derivation NOTE: if size of additional_derivations > Number.MAX_INTEGER, then we have a problem");
                const derivationIdx = additional_derivations.indexOf(derivation);
                if (derivationIdx !== -1) {
                    pubKey = additional_tx_pub_keys[derivationIdx];
                }
                console.log("conceal derivation with additional tx pub key");
            }
            if (pubKey === undefined) {
                throw Error("Mismatched derivation on scan info");
            }
            ledgerLog("conceal_derivation", {
                derivation: this.generate_key_derivation(pubKey, this.null_skey),
            }, "ret");
            return this.generate_key_derivation(pubKey, this.null_skey);
        });
    }
    derivation_to_scalar(derivation, output_index) {
        return __awaiter(this, void 0, void 0, function* () {
            ledgerLog("derivation_to_scalar", {
                derivation,
                output_index,
            }, "args");
            const [scalar] = yield this.send(commands_1.INS.DERIVATION_TO_SCALAR, 0x00, 0x00, [
                0x00,
                derivation,
                output_index >> 24,
                output_index >> 16,
                output_index >> 8,
                output_index >> 0,
            ], [32]);
            ledgerLog("derivation_to_scalar", {
                scalar,
            }, "ret");
            return scalar;
        });
    }
    derive_secret_key(derivation, output_index, sec) {
        return __awaiter(this, void 0, void 0, function* () {
            ledgerLog("derive_secret_key", {
                derivation,
                output_index,
                sec,
            }, "args");
            const [derivedSec] = yield this.send(commands_1.INS.DERIVE_SECRET_KEY, 0x00, 0x00, [
                0x00,
                derivation,
                output_index >> 24,
                output_index >> 16,
                output_index >> 8,
                output_index >> 0,
                sec,
            ], [32]);
            ledgerLog("derive_secret_key", {
                derivedSec,
            }, "args");
            return derivedSec;
        });
    }
    derive_public_key(derivation, output_index, pub) {
        return __awaiter(this, void 0, void 0, function* () {
            ledgerLog("derive_public_key", {
                derivation,
                output_index,
                pub,
            }, "args");
            const [derived_pub] = yield this.send(commands_1.INS.DERIVE_PUBLIC_KEY, 0x00, 0x00, [
                0x00,
                derivation,
                output_index >> 24,
                output_index >> 16,
                output_index >> 8,
                output_index >> 0,
                pub,
            ], [32]);
            ledgerLog("derive_public_key", {
                derived_pub,
            }, "ret");
            return derived_pub;
        });
    }
    secret_key_to_public_key(sec) {
        return __awaiter(this, void 0, void 0, function* () {
            ledgerLog("secret_key_to_public_key", {
                sec,
            }, "args");
            const [pub] = yield this.send(commands_1.INS.SECRET_KEY_TO_PUBLIC_KEY, 0x00, 0x00, [0x00, sec], [32]);
            ledgerLog("secret_key_to_public_key", {
                pub,
            }, "ret");
            return pub;
        });
    }
    generate_key_image(pub, sec) {
        return __awaiter(this, void 0, void 0, function* () {
            const [ki] = yield this.send(commands_1.INS.GEN_KEY_IMAGE, 0x00, 0x00, [0x00, pub, sec], [32]);
            return ki;
        });
    }
    // #endregion DERIVATION & KEY
    /* ======================================================================= */
    /*                               TRANSACTION                               */
    /* ======================================================================= */
    // #region TRANSACTION
    open_tx() {
        return __awaiter(this, void 0, void 0, function* () {
            ledgerLog("open_tx", {
                command: "open_tx",
            });
            const options = 0x00;
            const account = [0x00, 0x00, 0x00, 0x00];
            // skip over R and grab encrypted r instead
            const [, enc_r] = yield this.send(commands_1.INS.OPEN_TX, 0x01, 0x00, [options, ...account], [32, 64]);
            const sec_tx_key = enc_r;
            ledgerLog("open_tx", {
                sec_tx_key,
            }, "ret");
            return sec_tx_key;
        });
    }
    encrypt_payment_id(paymentId, public_key, secret_key) {
        return __awaiter(this, void 0, void 0, function* () {
            ledgerLog("encrypt_payment_id", {
                paymentId,
                public_key,
                secret_key,
            }, "args");
            const [enc_pid] = yield this.send(commands_1.INS.STEALTH, 0x00, 0x00, [0x00, public_key, secret_key, paymentId], [8]);
            ledgerLog("encrypt_payment_id", {
                enc_pid,
            }, "ret");
            return enc_pid;
        });
    }
    decrypt_payment_id(paymentId, public_key, secret_key) {
        return __awaiter(this, void 0, void 0, function* () {
            ledgerLog("decrypt_payment_id", {
                paymentId,
                public_key,
                secret_key,
            }, "args");
            return yield this.encrypt_payment_id(paymentId, public_key, secret_key);
        });
    }
    /**
     * @description store keys during construct_tx_with_tx_key to be later used during genRct ->  mlsag_prehash
     * @param {PublicKey} Aout
     * @param {PublicKey} Bout
     * @param {boolean} is_subaddress
     * @param {number} real_output_index
     * @param {Key} amount_key
     * @param {PublicKey} out_eph_public_key
     * @returns {Promise<boolean>}
     */
    add_output_key_mapping(Aout, Bout, is_subaddress, real_output_index, amount_key, out_eph_public_key) {
        ledgerLog("add_output_key_mapping", {
            Aout: Aout,
            Bout: Bout,
            is_subaddress,
            index: real_output_index,
            Pout: out_eph_public_key,
            AKout: amount_key,
        }, "args");
        this.key_map.add({
            Aout: Aout,
            Bout: Bout,
            is_subaddress,
            index: real_output_index,
            Pout: out_eph_public_key,
            AKout: amount_key,
        });
        return true;
    }
    ecdhEncode(unmasked, AKout) {
        return __awaiter(this, void 0, void 0, function* () {
            ledgerLog("ecdhEncode", {
                unmasked,
                AKout,
            }, "args");
            // AKout -> Amount key for output
            // AKout = encrypted private derivation data computed during the processing of output transaction keys
            // derivation data  = generate_key_derivation(Kv (recipent view public key), r (tx_key) ) = r.Kv
            // scalar = hash_to_scalar(Kv.r)
            // AKout = rct::sk2rct(Hn(rKv)) where rct::sk2rct just typecasts type crypto::secret_key to rct::key
            const [blindAmount, blindMask] = yield this.send(commands_1.INS.BLIND, 0x00, 0x00, [0x00, AKout, unmasked.mask, unmasked.amount], [32, 64]);
            ledgerLog("ecdhEncode", {
                blindAmount,
                blindMask,
            }, "ret");
            return { amount: blindAmount, mask: blindMask };
        });
    }
    ecdhDecode(masked, AKout) {
        return __awaiter(this, void 0, void 0, function* () {
            ledgerLog("ecdhDecode", {
                masked,
                AKout,
            }, "args");
            const [unmaskedAmount, unmaskedMask] = yield this.send(commands_1.INS.UNBLIND, 0x00, 0x00, [0x00, AKout, masked.mask, masked.amount], [32, 64]);
            ledgerLog("ecdhDecode", {
                unmaskedAmount,
                unmaskedMask,
            }, "ret");
            return { amount: unmaskedAmount, mask: unmaskedMask };
        });
    }
    mlsag_prehash(blob, inputs_size, // 64 bits
    outputs_size, // 64 bits
    hashes, outPk) {
        return __awaiter(this, void 0, void 0, function* () {
            ledgerLog("mlsag_prehash", {
                blob,
                inputs_size,
                outputs_size,
                hashes,
                outPk,
            }, "args");
            const data = Buffer.from(blob, "hex");
            const options = inputs_size === 0 ? 0x00 : 0x80;
            const type = data[0];
            const txnFee = [];
            let data_offset = 1;
            while (data[data_offset] & 0x80) {
                txnFee.push(data[data_offset]);
                data_offset += 1;
            }
            ledgerLog("mlsag_prehash", {}, "INS.VALIDATE p2 === 1");
            // monero_apdu_mlsag_prehash_init p2 === 1
            yield this.send(commands_1.INS.VALIDATE, 0x01, 0x01, [
                options,
                type,
                ...txnFee,
                data[data_offset],
            ]);
            data_offset += 1;
            // monero_apdu_mlsag_prehash_init p2 > 1
            // pseudoOuts
            if (type === RCT.RCTTypeSimple ||
                type === RCT.RCTTypeSimpleBulletproof) {
                for (let i = 0; i < inputs_size; i++) {
                    const p1 = 0x01;
                    const p2 = i + 0x02;
                    const opts = i === inputs_size - 1 ? 0x00 : 0x80;
                    // slice 32 bytes starting from data_offset
                    const pseudoOut = data
                        .slice(data_offset, data_offset + 32)
                        .toString("hex");
                    ledgerLog("mlsag_prehash", {}, `INS.VALIDATE p2 === ${p2}`);
                    yield this.send(commands_1.INS.VALIDATE, p1, p2, [opts, pseudoOut]);
                    data_offset += 32;
                }
            }
            // ======  Aout, Bout, AKout, C, v, k ======
            // where k is the mask
            // and v is the amount
            // Aout, Bout is the receiver main  view/spend public keys
            // keccak: 2nd group generator, such H = h.G and keccak is unknown
            // C is the commitment to v where Cv = k.G + v.H
            // monero_apdu_mlsag_prehash_update
            let kv_offset = data_offset;
            let C_offset = kv_offset + 32 * 2 * outputs_size;
            for (let i = 0; i < outputs_size; i++) {
                const outKeys = this.key_map.find(outPk[i].dest);
                if (!outKeys) {
                    throw Error(`Pout not found: ${outPk[i].dest} `);
                }
                const p1 = 0x02;
                const p2 = i + 0x01;
                const opts = i === outputs_size - 1 ? 0x00 : 0x80;
                const data_buf = [
                    opts,
                    outKeys.is_subaddress,
                    outKeys.Aout,
                    outKeys.Bout,
                    outKeys.AKout,
                ];
                // C
                data_buf.push(data.slice(C_offset, C_offset + 32).toString("hex"));
                C_offset += 32;
                // k
                data_buf.push(data.slice(kv_offset, kv_offset + 32).toString("hex"));
                kv_offset += 32;
                //v
                data_buf.push(data.slice(kv_offset, kv_offset + 32).toString("hex"));
                kv_offset += 32;
                ledgerLog("mlsag_prehash", {
                    outKeys,
                    p1,
                    p2,
                    opts,
                    data_buf,
                    C_offset,
                    kv_offset,
                }, `INS.VALIDATE p2 === ${p2}`);
                yield this.send(commands_1.INS.VALIDATE, p1, p2, data_buf);
            }
            // ======   C[], message, proof======
            let _i = 0;
            C_offset = kv_offset;
            for (_i = 0; _i < outputs_size; _i++) {
                const p1 = 0x03;
                const p2 = _i + 0x01;
                const opts = 0x80;
                // C
                const C = data.slice(C_offset, C_offset + 32).toString("hex");
                C_offset += 32;
                ledgerLog("mlsag_prehash", {
                    p1,
                    p2,
                    opts,
                    C,
                    C_offset,
                    kv_offset,
                }, `INS.VALIDATE p2 === ${p2}`);
                yield this.send(commands_1.INS.VALIDATE, p1, p2, [opts, C]);
            }
            const [prehash] = yield this.send(commands_1.INS.VALIDATE, 0x03, _i + 0x01, [0x00, hashes[0], hashes[2]], [32]);
            ledgerLog("mlsag_prehash", { prehash }, "ret");
            return prehash;
        });
    }
    mlsag_prepare(H, xx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!H || !xx) {
                const [a, aG] = yield this.send(commands_1.INS.MLSAG, 0x01, 0x00, [0x00], [32, 64]);
                return { a, aG };
            }
            else {
                ledgerLog("mlsag_prepare", { H, xx }, "args");
                // a -> alpha -> one time secret key for tx
                // aG -> alpha.G -> one time public key for tx
                const [a, aG, aHP, II] = yield this.send(commands_1.INS.MLSAG, 0x01, 0x00, [0x00, H, xx], [32, 64, 96, 128]);
                ledgerLog("mlsag_prepare", { a, aG, aHP, II }, "ret");
                return { a, aG, aHP, II };
            }
        });
    }
    mlsag_hash(long_message) {
        return __awaiter(this, void 0, void 0, function* () {
            ledgerLog("mlsag_hash", { long_message }, "args");
            // cnt is size_t
            const cnt = long_message.length;
            let res = "";
            for (let i = 0; i < cnt; i++) {
                [res] = yield this.send(commands_1.INS.MLSAG, 0x02, i + 0x01, [i === cnt - 1 ? 0x00 : 0x80, long_message[i]], [32]);
                ledgerLog("mlsag_hash", { res }, `iteration  ${i}`);
            }
            if (!res) {
                throw Error("Return value of last exchange is empty string");
            }
            ledgerLog("mlsag_hash", { res }, `ret`);
            return res;
        });
    }
    mlsag_sign(c, xx, alpha, rows, dsRows, ss) {
        return __awaiter(this, void 0, void 0, function* () {
            ledgerLog("mlsag_sign", {
                c,
                xx,
                alpha,
                rows,
                dsRows,
                ss,
            }, `args`);
            if (dsRows >= rows) {
                throw Error("dsRows greater than rows");
            }
            if (xx.length !== rows) {
                throw Error("xx size does not match rows");
            }
            if (alpha.length !== rows) {
                throw Error("alpha size does not match rows");
            }
            for (let j = 0; j < dsRows; j++) {
                // ss[j]
                const [res] = yield this.send(commands_1.INS.MLSAG, 0x03, j + 1, [j === dsRows - 1 ? 0x80 : 0x00, xx[j], alpha[j]], [32]);
                ss[j] = res;
                ledgerLog("mlsag_sign", {
                    "ss[j]": ss[j],
                    ss,
                }, `iteration ${j}`);
            }
            for (let j = dsRows; j < rows; j++) {
                // sc_mulsub(const unsigned char *a, const unsigned char *b, const unsigned char *c)  -> unsigned char *s
                // c - a.b mod l
                ss[j] = crypto.primitive_ops.sc_mulsub(c, xx[j], alpha[j]);
                ledgerLog("mlsag_sign", { "ss[j]": ss[j], ss }, `sc_mulsub  j:${j}`);
            }
            ledgerLog("mlsag_sign", { ss }, "ret");
            return ss;
        });
    }
    close_tx() {
        return __awaiter(this, void 0, void 0, function* () {
            ledgerLog("close_tx", { command: "close_tx" });
            yield this.send(commands_1.INS.CLOSE_TX, 0x00, 0x00, [0x00]);
            return true;
        });
    }
    // #endregion TRANSACTION
    // #region Internal private methods
    is_fake_view_key(viewKey) {
        return viewKey === this.hexString();
    }
    /**
     * @description Create a hex string by filling a array with the supplied value
     * and then converting it to a byte buffer, then to a string
     * @private
     * @param {number} [byteValue=0x00]
     * @param {number} [length=32]
     * @returns
     * @memberof XMR
     */
    hexString(byteValue = 0x00, length = 32) {
        return Buffer.alloc(length, byteValue, "hex").toString("hex");
    }
    /**
     *
     * @description Generates hex string slices from a buffer
     * @private
     * @param {Buffer} buffer to buffer to slice and convert into hex strings
     * @param {number[]} endingIndicesToSliceAt An array of ending indices to slice at
     *
     * Ex. If [32,64] is supplied, the following slices will be returned:
     *
     * [buffer.slice(0,32).toString("hex"),  buffer.slice(32,64).toString("hex")]
     * @memberof XMR
     */
    bufferToSlicedHexString(buffer, endingIndicesToSliceAt) {
        function sliceBufToHex(buf, start, end) {
            // initialize a buffer of required size
            // so we dont slice out of bounds if returned bytes
            // is less than slice size
            const zeroBuf = Buffer.alloc(end);
            // copy data into zero buffer
            buf.copy(zeroBuf);
            // slice
            const slice = zeroBuf.slice(start, end).toString("hex");
            return slice;
        }
        const res = endingIndicesToSliceAt.reduce((prev, currEndSliceIdx, idx, slicingIndices) => {
            return [
                ...prev,
                sliceBufToHex(buffer, !idx ? 0 : slicingIndices[idx - 1], currEndSliceIdx),
            ];
        }, []);
        return res;
    }
    arrLikeToBuf(arrLike) {
        return Array.isArray(arrLike)
            ? arrLike.reduce((accu, curr) => typeof curr === "string"
                ? Buffer.concat([accu, Buffer.from(curr, "hex")])
                : Buffer.concat([accu, Buffer.from([curr])]), Buffer.alloc(0))
            : arrLike;
    }
    // #endregion Internal private methods
    send(ins, p1, p2, data, endingIndicesToSliceAt) {
        return __awaiter(this, void 0, void 0, function* () {
            const serializedData = data ? this.arrLikeToBuf(data) : undefined;
            ledgerLog("send", {
                ins,
                p1,
                p2,
                data,
                serializedDataHex: serializedData
                    ? serializedData.toString("hex")
                    : undefined,
                endingIndicesToSliceAt,
            }, "before_send_to_ledger");
            const buf = yield this.transport.send(0x00, ins, p1, p2, serializedData);
            if (!endingIndicesToSliceAt) {
                return;
            }
            else {
                ledgerLog("send", { bufHex: buf.toString("hex") }, "returned buffer converted to hex string");
                const res = this.bufferToSlicedHexString(buf, endingIndicesToSliceAt);
                ledgerLog("send", { res }, "ret");
                return res;
            }
        });
    }
    notSupported() {
        throw Error("This device function is not supported");
    }
}
exports.LedgerDevice = LedgerDevice;
//# sourceMappingURL=device-ledger.js.map
