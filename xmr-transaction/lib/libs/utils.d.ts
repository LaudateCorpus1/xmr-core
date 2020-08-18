import { SignedTransaction } from "../types";
export declare function add_pub_key_to_extra(extra: string, pubkey: string): string;
export declare function add_nonce_to_extra(extra: string, nonce: string): string;
export declare function get_payment_id_nonce(payment_id: string, pid_encrypt: boolean): string;
export declare function abs_to_rel_offsets(offsets: string[]): string[];
export declare function serializeTxHeader(tx: SignedTransaction): string;
export declare function get_tx_prefix_hash(tx: SignedTransaction): string;
//# sourceMappingURL=utils.d.ts.map