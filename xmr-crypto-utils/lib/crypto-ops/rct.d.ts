import { Commit, Keys } from "../types";
import { HWDevice } from "../device";
export declare function commit(amount: string, mask: string): string;
export declare function zeroCommit(amount: string): string;
export declare function decode_ecdh(ecdh: Commit, key: string): Commit;
export declare function encode_ecdh(ecdh: Commit, key: string): Commit;
export declare function generate_key_image_helper(keys: Keys, tx_pub_key: string, out_index: number, enc_mask: string | null | undefined, hwdev: HWDevice): Promise<{
    in_ephemeral: {
        pub: string;
        sec: string;
        mask: string;
    };
    key_image: string;
}>;
export declare function scalarmultH(scalar: string): string;
//# sourceMappingURL=rct.d.ts.map