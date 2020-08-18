import { HWDevice, IAccountKeys, PublicAddress, DeviceMode, PublicKey, KeyDerivation, ISubaddressIndex, PublicSpendKey, SecretKey, Key, EcScalar, Hash8, KeyV, CtKeyV } from "./types";
import { KeyPair, Commit } from "../types";
export declare class DefaultDevice implements HWDevice {
    private name;
    constructor();
    set_name(name: string): boolean;
    get_name(): string;
    set_mode(_mode: DeviceMode): Promise<boolean>;
    get_public_address(): Promise<PublicAddress>;
    get_secret_keys(): Promise<any>;
    generate_chacha_key(_keys: IAccountKeys): Promise<any>;
    derive_subaddress_public_key(out_key: PublicKey, derivation: KeyDerivation, output_index: number): Promise<PublicKey>;
    get_subaddress_spend_public_key(keys: IAccountKeys, index: ISubaddressIndex): Promise<PublicKey>;
    get_subaddress_spend_public_keys(_keys: IAccountKeys, _account: number, _begin: number, _end: number): Promise<PublicSpendKey[]>;
    get_subaddress(keys: IAccountKeys, index: ISubaddressIndex): Promise<PublicAddress>;
    get_subaddress_secret_key(_sec: SecretKey, _index: ISubaddressIndex): Promise<SecretKey>;
    put_key(_privViewKey: string, _pubViewKey: string, _privSpendKey: string, _pubSpendKey: string, _b58PubKey: string): Promise<boolean>;
    verify_keys(secretKey: SecretKey, publicKey: PublicKey): Promise<boolean>;
    scalarmultKey(P: Key, a: Key): Promise<Key>;
    scalarmultBase(a: Key): Promise<Key>;
    sc_secret_add(a: SecretKey, b: SecretKey): Promise<SecretKey>;
    generate_keys(recoveryKey?: SecretKey): Promise<KeyPair>;
    generate_key_derivation(pub: PublicKey, sec: SecretKey): Promise<KeyDerivation>;
    conceal_derivation(derivation: KeyDerivation, _tx_pub_key: PublicKey, _additional_tx_pub_keys: PublicKey[], _main_derivation: KeyDerivation, _additional_derivations: KeyDerivation[]): Promise<PublicKey>;
    derivation_to_scalar(derivation: KeyDerivation, output_index: number): Promise<EcScalar>;
    derive_secret_key(derivation: KeyDerivation, output_index: number, sec: SecretKey): Promise<SecretKey>;
    derive_public_key(derivation: KeyDerivation, output_index: number, pub: PublicKey): Promise<PublicKey>;
    generate_key_image(pub: PublicKey, sec: SecretKey): Promise<PublicKey>;
    secret_key_to_public_key(sec: SecretKey): Promise<PublicKey>;
    open_tx(): Promise<SecretKey>;
    encrypt_payment_id(paymentId: string, public_key: string, secret_key: string): Promise<Hash8>;
    decrypt_payment_id(paymentId: string, public_key: string, secret_key: string): Promise<Hash8>;
    ecdhEncode(unmasked: Commit, sharedSec: SecretKey): Promise<Commit>;
    ecdhDecode(masked: Commit, sharedSec: SecretKey): Promise<Commit>;
    add_output_key_mapping(_Aout: PublicKey, _Bout: PublicKey, _is_subaddress: boolean, _real_output_index: number, _amount_key: Key, _out_eph_public_key: PublicKey): boolean;
    mlsag_prehash(_blob: string, _inputs_size: number, _outputs_size: number, hashes: KeyV, _outPk: CtKeyV): Promise<Key>;
    mlsag_prepare(H: Key, xx: Key): Promise<{
        a: Key;
        aG: Key;
        aHP: Key;
        II: Key;
    }>;
    mlsag_prepare(): Promise<{
        a: Key;
        aG: Key;
    }>;
    mlsag_hash(toHash: KeyV): Promise<Key>;
    mlsag_sign(c: Key, xx: KeyV, alpha: KeyV, rows: number, dsRows: number, ss: KeyV): Promise<KeyV>;
    close_tx(): Promise<boolean>;
    private notSupported;
}
//# sourceMappingURL=device-default.d.ts.map