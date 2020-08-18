/// <reference types="@ledgerhq__hw-transport" />
import Transport from "@ledgerhq/hw-transport";
import { HWDevice, DeviceMode, PublicAddress, Key, KeyDerivation, PublicKey, IAccountKeys, ISubaddressIndex, PublicSpendKey, SecretKey, EcScalar, Hash8, KeyV, CtKeyV, SecretKeys, ChachaKey } from "../types";
import { KeyPair, Commit } from "../../types";
export declare class LedgerDevice<T> implements HWDevice {
    private readonly transport;
    private name;
    private mode;
    private privateViewKey;
    private has_view_key;
    private readonly null_skey;
    private readonly key_map;
    constructor(transport: Transport<T>);
    reset(): Promise<undefined>;
    set_name(name: string): boolean;
    get_name(): string;
    set_mode(mode: DeviceMode): Promise<boolean>;
    put_key(privViewKey: string, pubViewKey: string, privSpendKey: string, pubSpendKey: string, _b58PubKey: string): Promise<boolean>;
    get_public_address(): Promise<PublicAddress>;
    /**
     *
     * @description Retrives the secret view key if the user allows the export
     * Skips retriving the view key if already previously exported
     * @returns Fake view and send private key
     * @memberof XMR
     */
    get_secret_keys(): Promise<SecretKeys>;
    export_private_view_key(): Promise<string>;
    generate_chacha_key(_keys: IAccountKeys): Promise<ChachaKey>;
    /**
     *
     * @param {PublicKey} pub
     * @param {KeyDerivation} derivation
     * @param {number} output_index
     * @returns {Promise<PublicKey>}
     * @memberof XMR
     */
    derive_subaddress_public_key(pub: PublicKey, derivation: KeyDerivation, output_index: number): Promise<PublicKey>;
    get_subaddress_spend_public_key(keys: IAccountKeys, index: ISubaddressIndex): Promise<PublicKey>;
    get_subaddress_spend_public_keys(keys: IAccountKeys, account: number, begin: number, end: number): Promise<PublicSpendKey[]>;
    get_subaddress(keys: IAccountKeys, index: ISubaddressIndex): Promise<PublicAddress>;
    get_subaddress_secret_key(sec: SecretKey, index: ISubaddressIndex): Promise<SecretKey>;
    verify_keys(secret_key: SecretKey, public_key: PublicKey): Promise<boolean>;
    scalarmultKey(P: Key, a: Key): Promise<Key>;
    scalarmultBase(a: Key): Promise<Key>;
    sc_secret_add(a: SecretKey, b: SecretKey): Promise<string>;
    generate_keys(recovery_key?: SecretKey): Promise<KeyPair>;
    generate_key_derivation(pub: PublicKey, sec: SecretKey): Promise<KeyDerivation>;
    conceal_derivation(derivation: KeyDerivation, tx_pub_key: PublicKey, additional_tx_pub_keys: PublicKey[], main_derivation: KeyDerivation, additional_derivations: KeyDerivation[]): Promise<string>;
    derivation_to_scalar(derivation: KeyDerivation, output_index: number): Promise<EcScalar>;
    derive_secret_key(derivation: KeyDerivation, output_index: number, sec: SecretKey): Promise<SecretKey>;
    derive_public_key(derivation: PublicKey, output_index: number, pub: PublicKey): Promise<PublicKey>;
    secret_key_to_public_key(sec: SecretKey): Promise<PublicKey>;
    generate_key_image(pub: PublicKey, sec: SecretKey): Promise<PublicKey>;
    open_tx(): Promise<SecretKey>;
    encrypt_payment_id(paymentId: string, public_key: string, secret_key: string): Promise<Hash8>;
    decrypt_payment_id(paymentId: string, public_key: string, secret_key: string): Promise<Hash8>;
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
    add_output_key_mapping(Aout: PublicKey, Bout: PublicKey, is_subaddress: boolean, real_output_index: number, amount_key: Key, out_eph_public_key: PublicKey): boolean;
    ecdhEncode(unmasked: Commit, AKout: SecretKey): Promise<Commit>;
    ecdhDecode(masked: Commit, AKout: SecretKey): Promise<Commit>;
    mlsag_prehash(blob: string, inputs_size: number, // 64 bits
    outputs_size: number, // 64 bits
    hashes: KeyV, outPk: CtKeyV): Promise<Key>;
    /**
     *
     * @description Generate the matrix ring parameters
     * @param {Key} H
     * @param {Key} xx
     * @returns {Promise<{ a: Key, aG: Key, aHP: Key, II: Key }>}
     * @memberof Device
     */
    mlsag_prepare(H: Key, xx: Key): Promise<{
        a: Key;
        aG: Key;
        aHP: Key;
        II: Key;
    }>;
    /**
     *
     * @description Generate the matrix ring parameters
     * @returns {Promise<{ a: Key, aG: Key }>}
     * @memberof Device
     */
    mlsag_prepare(): Promise<{
        a: Key;
        aG: Key;
    }>;
    mlsag_hash(long_message: KeyV): Promise<Key>;
    mlsag_sign(c: Key, xx: KeyV, alpha: KeyV, rows: number, dsRows: number, ss: KeyV): Promise<KeyV>;
    close_tx(): Promise<boolean>;
    private is_fake_view_key;
    /**
     * @description Create a hex string by filling a array with the supplied value
     * and then converting it to a byte buffer, then to a string
     * @private
     * @param {number} [byteValue=0x00]
     * @param {number} [length=32]
     * @returns
     * @memberof XMR
     */
    private hexString;
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
    private bufferToSlicedHexString;
    private arrLikeToBuf;
    private send;
    private notSupported;
}
//# sourceMappingURL=device-ledger.d.ts.map